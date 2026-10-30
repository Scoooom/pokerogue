/**
 * A `StarterMarking` represents one of the Gen IV+ box marking symbols a player
 * can stamp onto a starter species for personal organization and filtering.
 * @see {@link https://bulbapedia.bulbagarden.net/wiki/Marking}
 */
export enum StarterMarking {
  CIRCLE,
  SQUARE,
  TRIANGLE,
  HEART,
  STAR,
  DIAMOND,
}

export interface StarterMarkingInfo {
  marking: StarterMarking;
  /** The texture key this marking's icon is loaded under (see `loading-scene.ts`). */
  textureKey: string;
  /** The `filter-bar` locale key for this marking's base (unselected) label. */
  labelKey: string;
}

/** Metadata for every {@linkcode StarterMarking}, in display order. */
export const STARTER_MARKINGS: StarterMarkingInfo[] = [
  { marking: StarterMarking.CIRCLE, textureKey: "mark_circle", labelKey: "circleMark" },
  { marking: StarterMarking.SQUARE, textureKey: "mark_square", labelKey: "squareMark" },
  { marking: StarterMarking.TRIANGLE, textureKey: "mark_triangle", labelKey: "triangleMark" },
  { marking: StarterMarking.HEART, textureKey: "mark_heart", labelKey: "heartMark" },
  { marking: StarterMarking.STAR, textureKey: "mark_star", labelKey: "starMark" },
  { marking: StarterMarking.DIAMOND, textureKey: "mark_diamond", labelKey: "diamondMark" },
];
