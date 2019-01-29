import { describeCrossPlatform } from 'jest-expo';
import { NativeModulesProxy } from 'expo-core';
import * as Amplitude from '../Amplitude';

const { ExpoAmplitude } = NativeModulesProxy;

describeCrossPlatform('all Amplitude methods available', () => {
  it('initializes', () => {
    expect(Amplitude.initialize('test-api-key')).toBeUndefined();
    expect(ExpoAmplitude.initialize).toHaveBeenCalledTimes(1);
  });

  it('can setUserId', () => {
    expect(Amplitude.setUserId('user-id')).toBeUndefined();
    expect(ExpoAmplitude.setUserId).toHaveBeenCalledWith('user-id');
  });

  it('can setUserProperties', () => {
    expect(Amplitude.setUserProperties({ some: 'property' })).toBeUndefined();
    expect(ExpoAmplitude.setUserProperties).toHaveBeenCalledWith({
      some: 'property',
    });
  });

  it('can clearUserProperties', () => {
    expect(Amplitude.clearUserProperties()).toBeUndefined();
    expect(ExpoAmplitude.clearUserProperties).toHaveBeenCalledTimes(1);
  });

  it('can logEvent', () => {
    expect(Amplitude.logEvent('event-name')).toBeUndefined();
    expect(ExpoAmplitude.logEvent).toHaveBeenCalledWith('event-name');
  });

  it('can logEventWithProperties', () => {
    expect(Amplitude.logEventWithProperties('event-name', { some: 'property' })).toBeUndefined();
    expect(ExpoAmplitude.logEventWithProperties).toHaveBeenCalledWith(
      'event-name',
      { some: 'property' }
    );
  });

  it('can setGroup', () => {
    expect(Amplitude.setGroup('group', ['group', 'names', 'array'])).toBeUndefined();
    expect(ExpoAmplitude.setGroup).toHaveBeenCalledWith('group', [
      'group',
      'names',
      'array',
    ]);
  });
});
