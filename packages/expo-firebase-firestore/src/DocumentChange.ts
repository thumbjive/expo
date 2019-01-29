import DocumentSnapshot from './DocumentSnapshot';

import { Firestore, NativeDocumentChange } from './firestoreTypes.flow';

/**
 * @class DocumentChange
 */
export default class DocumentChange {
  _document: DocumentSnapshot;

  _newIndex: number;

  _oldIndex: number;

  _type: 'added' | 'modified' | 'removed';

  constructor(firestore: Firestore, nativeData: NativeDocumentChange) {
    this._document = new DocumentSnapshot(firestore, nativeData.document);
    this._newIndex = nativeData.newIndex;
    this._oldIndex = nativeData.oldIndex;
    this._type = nativeData.type;
  }

  get doc(): DocumentSnapshot {
    return this._document;
  }

  get newIndex(): number {
    return this._newIndex;
  }

  get oldIndex(): number {
    return this._oldIndex;
  }

  get type(): string {
    return this._type;
  }
}
