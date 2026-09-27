import { SourceType, StudioConfig, VisionMixerDevice } from '../../../base/studio/helpers/config.js'

export const LhbDemoStudioConfig: StudioConfig = {
	previewRenderer: 'sofie',
	casparcgLatency: 0,
	visionMixer: {
		type: VisionMixerDevice.OBS,
		host: 'localhost',
		port: 4455,
		deviceId: 'obs0',
	},
	audioMixer: {
		host: 'localhost',
		port: 1176,
		deviceId: 'sisyfos0',
	},
	casparcg: {
		host: 'localhost',
		port: 5250,
	},
	sisyfosSources: {},
	vmixSources: {},
	atemOutputs: {},
	atemSources: {},
	obsSources: {
		camera1: { input: 'Camera 1', type: SourceType.Camera },
		camera2: { input: 'Camera 2', type: SourceType.Camera },
		os1: { input: 'OS 1', type: SourceType.Remote },
		txA: { input: 'Caspar 1 (TX A)', type: SourceType.MediaPlayer },
		//txB: { input: 'Caspar 2 (TX B)', type: SourceType.MediaPlayer },
		graphics: { input: 'Caspar 3 (Graphics)', type: SourceType.Graphics },
	},
}
