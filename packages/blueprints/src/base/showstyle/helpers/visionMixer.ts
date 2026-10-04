import { PieceAbSessionInfo, TSR } from '@sofie-automation/blueprints-integration'
import { assertUnreachable, literal } from '../../../common/util.js'
import { TimelineBlueprintExt } from '../../studio/customTypes.js'
import {
	InputConfig,
	ObsInputConfig,
	StudioConfig,
	VisionMixerDevice,
	VmixInputConfig,
} from '../../studio/helpers/config.js'
import { AtemLayers, CasparCGLayers, ObsLayers, VMixLayers } from '../../studio/layers.js'

export function createAtemInputTimelineObjects(
	input: number,
	start = 0,
	transitionDuration = 40,
	transitionProps?: Omit<TSR.TimelineContentAtemME['me'], 'programInput' | 'previewInput'>,
	keyframes = [],
	abSessions: Array<PieceAbSessionInfo> = []
): TimelineBlueprintExt<TSR.TimelineContentAtemME>[] {
	return [
		literal<TimelineBlueprintExt<TSR.TimelineContentAtemME>>({
			id: '',
			enable: { start: start },
			layer: AtemLayers.AtemMeProgram,
			content: {
				deviceType: TSR.DeviceType.ATEM,
				type: TSR.TimelineContentTypeAtem.ME,

				me: {
					programInput: input,
				},
			},
			keyframes: [
				...keyframes,
				{
					id: '',
					enable: {
						start: 0,
						duration: transitionDuration, // only used to do the transition
					},
					content: {
						me: {
							input: input,
							transition: TSR.AtemTransitionStyle.CUT,
							...(transitionProps || {}),
						},
					},
				},
			],
			priority: 1,
			abSessions,
		}),
		// Add object for preview
		literal<TimelineBlueprintExt<TSR.TimelineContentAtemME>>({
			id: '',
			enable: { start: start },
			layer: AtemLayers.AtemMePreview,
			content: {
				deviceType: TSR.DeviceType.ATEM,
				type: TSR.TimelineContentTypeAtem.ME,

				me: {
					previewInput: 0,
				},
			},
			keyframes: [
				...keyframes,
				{
					id: '',
					enable: {
						start: transitionDuration + 40, // after the transition keyframe
					},
					content: {
						me: {
							previewInput: input,
						},
					},
					preserveForLookahead: true,
				},
			],
			priority: 1,
			abSessions,
		}),
	]
}

export function createVMixTimelineObjects(
	input: number,
	start = 0,
	transitionDuration = 40,
	transitionProps?: TSR.VMixTransition,
	keyframes = [],
	abSessions: Array<PieceAbSessionInfo> = []
): TimelineBlueprintExt<TSR.TimelineContentVMixAny>[] {
	return [
		literal<TimelineBlueprintExt<TSR.TimelineContentVMixProgram>>({
			id: '',
			enable: { start: start },
			layer: VMixLayers.VMixMeProgram,
			content: {
				deviceType: TSR.DeviceType.VMIX,
				type: TSR.TimelineContentTypeVMix.PROGRAM,

				input,
				transition: transitionProps,
			},
			keyframes,
			priority: 1,
			abSessions,
		}),

		// Add object for preview
		literal<TimelineBlueprintExt<TSR.TimelineContentVMixPreview>>({
			id: '',
			enable: { start: start },
			layer: VMixLayers.VMixMePreview,
			content: {
				deviceType: TSR.DeviceType.VMIX,
				type: TSR.TimelineContentTypeVMix.PREVIEW,

				input: 0,
			},
			keyframes: [
				...keyframes,
				{
					id: '',
					enable: {
						start: transitionDuration + 40, // after the transition keyframe
					},
					content: {
						input,
					},
					preserveForLookahead: true,
				},
			],
			priority: 1,
			abSessions,
		}),
	]
}

export function createObsTimelineObjects(
	sceneName: string | undefined,
	start = 0,
	keyframes = [],
	abSessions: Array<PieceAbSessionInfo> = []
): TimelineBlueprintExt<TSR.TimelineContentOBSCurrentScene | TSR.TimelineContentOBSCurrentTransition>[] {
	return [
		literal<TimelineBlueprintExt<TSR.TimelineContentOBSCurrentScene>>({
			id: '',
			enable: { start: start },
			layer: ObsLayers.ObsProgram,
			content: {
				deviceType: TSR.DeviceType.OBS,
				type: TSR.TimelineContentTypeOBS.CURRENT_SCENE,
				sceneName: sceneName || 'BLACK',
			},
			keyframes,
			priority: 1,
			abSessions,
		}),
		literal<TimelineBlueprintExt<TSR.TimelineContentOBSCurrentScene>>({
			id: '',
			enable: { start: start + 40 },
			layer: ObsLayers.ObsPreview,
			content: {
				deviceType: TSR.DeviceType.OBS,
				type: TSR.TimelineContentTypeOBS.CURRENT_SCENE,
				sceneName: sceneName || 'BLACK',
			},
			keyframes,
			// keyframes: [
			// 	{
			// 		id: '',
			// 		enable: {
			// 			start: 40, // after the transition keyframe
			// 		},
			// 		content: {
			// 			sceneName,
			// 		},
			// 		preserveForLookahead: true,
			// 	},
			// ],
			priority: 0.1,
			abSessions,
		}),
	]
}

function expectsNumberInput(input: number | string | undefined): number {
	if (typeof input !== 'number' && input !== undefined) {
		throw new Error(`Vision mixer expects input to be a number, but got ${input}`)
	} else if (input === undefined) {
		input = 0
	}
	return input
}

function expectsStringInput(input: number | string | undefined): string | undefined {
	if (typeof input !== 'string' && input !== undefined) {
		throw new Error(`Vision mixer expects input to be a string, but got ${input}`)
	}
	return input
}

export function createVisionMixerObjects(
	config: StudioConfig,
	input: number | string | undefined,
	start = 0,
	transitionDuration = 40,
	transitionProps?: {
		atemTransitionProps?: Omit<TSR.TimelineContentAtemME['me'], 'programInput' | 'previewInput'>
		vmixTransitionProps?: TSR.VMixTransition
	},
	keyframes = [],
	abSessions: Array<PieceAbSessionInfo> = []
): TimelineBlueprintExt<TSR.TimelineContentVMixAny | TSR.TimelineContentAtemAny | TSR.TimelineContentOBSAny>[] {
	if (config.visionMixer.type === VisionMixerDevice.Atem) {
		return createAtemInputTimelineObjects(
			expectsNumberInput(input),
			start,
			transitionDuration,
			transitionProps?.atemTransitionProps,
			keyframes,
			abSessions
		)
	} else if (config.visionMixer.type === VisionMixerDevice.VMix) {
		return createVMixTimelineObjects(
			expectsNumberInput(input),
			start,
			transitionDuration,
			transitionProps?.vmixTransitionProps,
			keyframes,
			abSessions
		)
	} else if (config.visionMixer.type === VisionMixerDevice.OBS) {
		return createObsTimelineObjects(expectsStringInput(input), start, keyframes, abSessions)
	} else {
		assertUnreachable(config.visionMixer.type)
		return []
	}
}

export function createAbVisionMixerObjects(
	config: StudioConfig,
	abSession: PieceAbSessionInfo,
	start = 0,
	transitionDuration = 40,
	transitionProps?: {
		atemTransitionProps?: Omit<TSR.TimelineContentAtemME['me'], 'programInput' | 'previewInput'>
		vmixTransitionProps?: TSR.VMixTransition
	}
): TimelineBlueprintExt<TSR.TimelineContentVMixAny | TSR.TimelineContentAtemAny | TSR.TimelineContentOBSAny>[] {
	const sources = getVisionMixerSources(config)
	const player1content =
		config.visionMixer.type === VisionMixerDevice.OBS
			? { sceneName: expectsStringInput(sources.player1.input) }
			: { input: expectsNumberInput(sources.player1.input) }

	const player2content =
		config.visionMixer.type === VisionMixerDevice.OBS
			? { sceneName: expectsStringInput(sources.player2.input) }
			: { input: expectsNumberInput(sources.player2.input) }

	const keyframes = [
		{
			id: `player1`,
			enable: { while: '1' },
			disabled: true,
			// content: { sceneName: config.obsSources.player1.input },
			content: player1content,
			preserveForLookahead: true,
			abSession: {
				poolName: abSession.poolName,
				playerId: CasparCGLayers.CasparCGClipPlayer1,
			},
		},
		{
			id: `player2`,
			enable: { while: '1' },
			disabled: true,
			// content: { sceneName: config.obsSources.player2.input },
			content: player2content,
			preserveForLookahead: true,
			abSession: {
				poolName: abSession.poolName,
				playerId: CasparCGLayers.CasparCGClipPlayer2,
			},
		},
	]

	return createVisionMixerObjects(config, undefined, start, transitionDuration, transitionProps, keyframes, [abSession])
}

export function getVisionMixerSources(
	config: StudioConfig
): { [k: string]: InputConfig } | { [k: string]: VmixInputConfig } | { [k: string]: ObsInputConfig } {
	if (config.visionMixer.type === VisionMixerDevice.Atem) {
		return config.atemSources
	} else if (config.visionMixer.type === VisionMixerDevice.VMix) {
		return config.vmixSources
	} else if (config.visionMixer.type === VisionMixerDevice.OBS) {
		return config.obsSources
	} else {
		assertUnreachable(config.visionMixer.type)
	}
}
