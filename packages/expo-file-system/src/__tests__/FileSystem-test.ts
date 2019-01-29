import { mockProperty } from 'jest-expo';

import ExponentFileSystem from '../ExponentFileSystem';
import * as FileSystem from '../FileSystem';

describe('FileSystem', () => {
  const throws = async run => {
    let error = null;
    try {
      await run();
    } catch (e) {
      error = e;
    }
    expect(error).toBeTruthy();
  };

  describe('DownloadResumable', () => {
    const remoteUri = 'http://techslides.com/demos/sample-videos/small.mp4';
    const localUri = FileSystem.documentDirectory + 'small.mp4';
    const options = {};
    const resumeData = '';
    const fakeObject = {
      url: remoteUri,
      fileUri: localUri,
      options,
      resumeData,
    };
    const callback = downloadProgress => {
      const progress =
        downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite;
    };
    let downloadResumable;
    beforeEach(() => {
      downloadResumable = FileSystem.createDownloadResumable(
        remoteUri,
        localUri,
        options,
        callback,
        resumeData
      );
    });

    it('downloads with the correct props', async () => {
      await downloadResumable.downloadAsync();

      expect(ExponentFileSystem.downloadResumableStartAsync).toHaveBeenCalledWith(
        remoteUri,
        localUri,
        downloadResumable._uuid,
        options,
        resumeData
      );
    });

    it('pauses correctly', async () => {
      mockProperty(
        ExponentFileSystem,
        'downloadResumablePauseAsync',
        jest.fn(async () => fakeObject)
      );

      const downloadPauseState = await downloadResumable.pauseAsync();

      expect(downloadPauseState).toMatchObject(fakeObject);

      expect(ExponentFileSystem.downloadResumablePauseAsync).toHaveBeenCalledWith(
        downloadResumable._uuid
      );
    });
    it('pauses with error', async () => {
      throws(downloadResumable.pauseAsync());
    });

    it('resumes correctly', async () => {
      mockProperty(
        ExponentFileSystem,
        'downloadResumableStartAsync',
        jest.fn(async () => fakeObject)
      );

      const downloadPauseState = await downloadResumable.resumeAsync();

      expect(downloadPauseState).toMatchObject(fakeObject);

      expect(ExponentFileSystem.downloadResumableStartAsync).toHaveBeenCalledWith(
        remoteUri,
        localUri,
        downloadResumable._uuid,
        options,
        resumeData
      );
    });

    it('has same save state as original input', async () => {
      const downloadPauseState = await downloadResumable.savable();

      expect(downloadPauseState).toMatchObject(fakeObject);
    });
  });
});
