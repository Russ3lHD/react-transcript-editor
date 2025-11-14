// eslint-disable-next-line no-unused-vars
import React from 'react';
import { render, cleanup } from '@testing-library/react';


import MediaPlayer from './index.js';

afterEach(cleanup);

const fakeVideoUrl = 'https://storage.googleapis.com/coverr-main/mp4/Pigeon-Impossible.mp4';

xtest('GIVEN a chapter title I expect that WHEN the Video component is rendered THEN the correct title is displayed', () => {
  const { container } = render(<MediaPlayer mediaUrl={ fakeVideoUrl } />);

  expect(container.innerHTML).toContain('videoSection');
});

xtest("GIVEN a video as a chapter with src video url THEN the video is rendered with it's source url", () => {
  const { getByTestId } = render(<MediaPlayer mediaUrl={ fakeVideoUrl } />);

  expect(getByTestId('media-player-id').attributes.src.value).toBe(fakeVideoUrl);
});
