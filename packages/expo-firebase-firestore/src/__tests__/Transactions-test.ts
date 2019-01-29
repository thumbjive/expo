import firebase from 'expo-firebase-app';

import { Platform } from 'expo-core';

const { OS } = Platform;

export default function test({
  should,
  TestHelpers: {
    firestore: { testDocRef },
  },
}) {
  describe('firestore()', () => {
    describe('runTransaction()', () => {
      it('should set() values', async () => {
        const firestore = firebase.firestore();
        const docRef = testDocRef('tSet');

        const updateFunction = async transaction => {
          const doc = await transaction.get(docRef);
          if (!doc.exists) {
            transaction.set(docRef, { value: 1, somethingElse: 'set' });
            return 1;
          }

          return 0;
        };

        const result = await firestore.runTransaction(updateFunction);
        expect(result).toBe(1);
        const finalDoc = await docRef.get();
        finalDoc.data().value.should.equal(1);
        finalDoc.data().somethingElse.should.equal('set');
      });

      it('should update() values', async () => {
        const firestore = firebase.firestore();
        const docRef = testDocRef('tUpdate');

        await docRef.set({ value: 1 });

        const updateFunction = async transaction => {
          const doc = await transaction.get(docRef);
          if (doc.exists) {
            transaction.update(docRef, {
              value: doc.data().value + 1,
              somethingElse: 'update',
            });
            return 1;
          }

          return 0;
        };

        const result = await firestore.runTransaction(updateFunction);
        expect(result).toBe(1);

        const finalDoc = await docRef.get();
        finalDoc.data().value.should.equal(2);
        finalDoc.data().somethingElse.should.equal('update');
      });

      it('should delete() values', async () => {
        const firestore = firebase.firestore();
        const docRef = testDocRef('tDelete');
        await docRef.set({ value: 1, somethingElse: 'delete' });

        const updateFunction = async transaction => {
          const doc = await transaction.get(docRef);
          if (doc.exists) {
            transaction.delete(docRef);
            return 1;
          }

          return 0;
        };

        const result = await firestore.runTransaction(updateFunction);
        expect(result).toBe(1);

        const finalDoc = await docRef.get();
        finalDoc.exists.should.equal(false);
      });

      it('error if updateFn does return a promise', async () => {
        const firestore = firebase.firestore();

        // test async functions - they always return a promise in JS
        let didReject = false;
        let updateFunction: any = async () => 1;
        try {
          await firestore.runTransaction(updateFunction);
        } catch (e) {
          didReject = true;
        }
        expect(didReject).toBe(false);

        // should not error as a promise returned
        didReject = false;
        updateFunction = async () => {};
        try {
          await firestore.runTransaction(updateFunction);
        } catch (e) {
          didReject = true;
        }
        expect(didReject).toBe(false);

        // should error as no promise returned
        didReject = false;
        updateFunction = () => '123456';
        try {
          await firestore.runTransaction(updateFunction);
        } catch (e) {
          didReject = true;
          e.message.includes('must return a Promise');
        }
        expect(didReject).toBe(true);
      });

      it('updateFn promise rejections / js exceptions handled', async () => {
        const firestore = firebase.firestore();

        // rejections
        let didReject = false;
        // eslint-disable-next-line
        let updateFunction = () => Promise.reject('shoop');
        try {
          await firestore.runTransaction(updateFunction);
        } catch (e) {
          didReject = true;
          expect(e).toBe('shoop');
        }
        expect(didReject).toBe(true);

        // exceptions
        didReject = false;
        updateFunction = () => {
          // eslint-disable-next-line no-throw-literal
          throw 'doop';
        };
        try {
          await firestore.runTransaction(updateFunction);
        } catch (e) {
          didReject = true;
          expect(e).toBe('doop');
        }
        expect(didReject).toBe(true);
      });

      it('handle native exceptions', async () => {
        const firestore = firebase.firestore();
        const docRef = testDocRef('tSet');
        const blockedRef = firestore.doc('denied/foo');

        const updateFunction = async transaction => {
          await transaction.get(docRef);
          transaction.set(blockedRef, { value: 1, somethingElse: 'set' });
          return 1;
        };

        // rejections
        let didReject = false;
        try {
          await firestore.runTransaction(updateFunction);
        } catch (e) {
          // TODO sdks are giving different errors - standardise?
          if (OS === 'ios') {
            e.message.should.containEql('firestore/failed-precondition');
          } else {
            e.message.should.containEql('firestore/aborted');
          }
          didReject = true;
        }
        expect(didReject).toBe(true);
      });
    });
  });
}
