import { SourceType, StudioConfig } from '../../studio/helpers/config.js'
import {
	InputConfig,
	ObsInputConfig,
	VisionMixerDevice,
	VmixInputConfig,
} from '../../..//$schemas/generated/main-studio-config.js'

export interface RawSourceInfo {
	type: SourceType
	/** 1-based number */
	id: number
}

export interface SourceInfo extends RawSourceInfo {
	input: number | string | undefined
}

export function findSource(input: string | number | boolean | undefined, type: SourceType): RawSourceInfo | undefined {
	const match = (input + '').match(/(.*?)(\d+)(.*)/) // find the first number
	if (match) {
		return {
			id: Number(match[2]),
			type,
		}
	} else {
		return undefined
	}
}

export function getSourceInfoFromRaw(config: StudioConfig, rawInfo: RawSourceInfo): SourceInfo {
	let sourcesOfType = undefined

	if (config.visionMixer.type == VisionMixerDevice.Atem) {
		sourcesOfType = Object.values<InputConfig>(config.atemSources).filter((s) => s.type === rawInfo.type)
	} else if (config.visionMixer.type === VisionMixerDevice.VMix) {
		sourcesOfType = Object.values<VmixInputConfig>(config.vmixSources).filter((s) => s.type === rawInfo.type)
	} else if (config.visionMixer.type === VisionMixerDevice.OBS) {
		sourcesOfType = Object.values<ObsInputConfig>(config.obsSources).filter((s) => s.type === rawInfo.type)
	}

	let input = undefined

	if (sourcesOfType !== undefined) {
		input = sourcesOfType[rawInfo.id - 1]
	}

	return {
		...rawInfo,
		input: input && input.input,
	}
}
