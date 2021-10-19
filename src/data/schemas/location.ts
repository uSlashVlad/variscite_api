export interface IGeolocation {
  isHidden: boolean;
  time?: number;
  position: IGeoPosition;
}

export interface IUserGeolocationOutput {
  user: string;
  position: IGeoPosition;
}

export interface IGeoPosition {
  lat: number;
  lon: number;
}

export interface IGeoPositionInput {
  latitude: number;
  longitude: number;
}

export function convertPosition(input: IGeoPositionInput): IGeoPosition {
  return { lat: input.latitude, lon: input.longitude };
}
