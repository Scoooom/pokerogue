import type { PokemonSpecies } from "#data/pokemon-species";
import { AbilityAttr } from "#enums/ability-attr";
import { AbilityId } from "#enums/ability-id";
import { DexAttr } from "#enums/dex-attr";
import type { DexEntry } from "#types/dex-data";
import type { StarterDataEntry } from "#types/save-data";

/** Bitmask of all non-form {@linkcode DexAttr} flags (shininess, shiny variant, gender). */
const SHINY_GENDER_MASK =
  DexAttr.NON_SHINY
  | DexAttr.SHINY
  | DexAttr.MALE
  | DexAttr.FEMALE
  | DexAttr.DEFAULT_VARIANT
  | DexAttr.VARIANT_2
  | DexAttr.VARIANT_3;

/** Bitmask covering all 25 possible {@linkcode Nature} values in a {@linkcode DexEntry.natureAttr}. */
const ALL_NATURES_MASK = Array.from({ length: 25 }, (_, n) => 1 << (n + 1)).reduce((acc, bit) => acc | bit, 0);

/**
 * Computes the bitmask of {@linkcode DexAttr} form flags required to consider every *starter-selectable*
 * form of a species caught.
 *
 * @remarks
 * Unlike {@linkcode PokemonSpecies.getFullUnlocksData}, which counts every obtainable form (including
 * battle-only forms such as Mega Evolutions or Gigantamax that can never be chosen as a starter), this
 * only requires forms that can actually be selected on the starter select screen.
 */
function getStarterFormMask(species: PokemonSpecies): bigint {
  if (species.forms.length <= 1) {
    return DexAttr.DEFAULT_FORM;
  }
  return species.forms.reduce(
    (mask, form, index) => (form.isStarterSelectable ? mask | (DexAttr.DEFAULT_FORM << BigInt(index)) : mask),
    0n,
  );
}

/**
 * Determines whether a species' Pokédex entry is "100% complete": every starter-selectable form has been
 * caught in both shiny and non-shiny, across every obtainable gender and shiny variant, and every possible
 * ability and nature has been recorded.
 */
export function isSpeciesFullyComplete(
  species: PokemonSpecies,
  dexEntry: DexEntry,
  starterData: StarterDataEntry,
): boolean {
  const requiredAttr = (species.getFullUnlocksData() & SHINY_GENDER_MASK) | getStarterFormMask(species);
  const fitsCaught = (dexEntry.caughtAttr & requiredAttr) === requiredAttr;

  const speciesHasSingleAbility = species.ability2 === species.ability1;
  const speciesHasHiddenAbility =
    species.abilityHidden !== species.ability1 && species.abilityHidden !== AbilityId.NONE;
  const fitsAbilities =
    !!(starterData.abilityAttr & AbilityAttr.ABILITY_1)
    && (speciesHasSingleAbility || !!(starterData.abilityAttr & AbilityAttr.ABILITY_2))
    && (!speciesHasHiddenAbility || !!(starterData.abilityAttr & AbilityAttr.ABILITY_HIDDEN));

  const fitsNatures = (dexEntry.natureAttr & ALL_NATURES_MASK) === ALL_NATURES_MASK;

  return fitsCaught && fitsAbilities && fitsNatures;
}
