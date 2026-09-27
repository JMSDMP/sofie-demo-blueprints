import { BlueprintMappings, BlueprintMapping, TSR, LookaheadMode } from '@sofie-automation/blueprints-integration'
import { literal } from '../../../../common/util.js'
import { BlueprintConfig } from '../../helpers/config.js'
import { ObsLayers } from '../../layers.js'

export function getObsMappings(_config: BlueprintConfig): BlueprintMappings {
	const mappings: BlueprintMappings = {
		[ObsLayers.ObsProgram]: literal<BlueprintMapping<TSR.MappingObsCurrentScene>>({
			device: TSR.DeviceType.OBS,
			deviceId: 'obs0',
			lookahead: LookaheadMode.NONE,

			options: { mappingType: TSR.MappingObsType.CurrentScene },
		}),
		[ObsLayers.ObsPreview]: literal<BlueprintMapping<TSR.MappingObsCurrentScene>>({
			device: TSR.DeviceType.OBS,
			deviceId: 'obs0',
			lookahead: LookaheadMode.PRELOAD,
			lookaheadMaxSearchDistance: 1,
			lookaheadDepth: 1,

			options: { mappingType: TSR.MappingObsType.CurrentScene },
		}),
		[ObsLayers.ObsDVE]: literal<BlueprintMapping<TSR.MappingObsSceneItem>>({
			device: TSR.DeviceType.OBS,
			deviceId: 'obs0',
			lookahead: LookaheadMode.WHEN_CLEAR,
			lookaheadMaxSearchDistance: 1,

			options: { mappingType: TSR.MappingObsType.SceneItem, sceneName: '', source: '' },
		}),
	}

	return mappings
}
