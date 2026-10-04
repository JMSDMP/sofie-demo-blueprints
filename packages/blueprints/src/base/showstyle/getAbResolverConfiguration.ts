import {
	ABPlayerDefinition,
	AbPlayerId,
	ABResolverConfiguration,
	IShowStyleContext,
} from '@sofie-automation/blueprints-integration'
import { CasparCGLayers } from '../studio/layers.js'

// This is a very basic implementation of the ABResolverConfiguration:
export function getAbResolverConfiguration(_context: IShowStyleContext): ABResolverConfiguration {
	const player1: ABPlayerDefinition = {
		playerId: CasparCGLayers.CasparCGClipPlayer1,
	}
	const player2: ABPlayerDefinition = {
		playerId: CasparCGLayers.CasparCGClipPlayer2,
	}
	return {
		resolverOptions: {
			idealGapBefore: 1000,
			nowWindow: 2000,
		},
		pools: {
			clip: [player1, player2],
		},
		timelineObjectLayerChangeRules: {
			[CasparCGLayers.CasparCGAbPending]: {
				acceptedPoolNames: ['clip'],
				newLayerName: (playerId: AbPlayerId) => String(playerId),
				allowsLookahead: true,
			},
		},
	}
}
