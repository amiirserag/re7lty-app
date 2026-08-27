import type { Car, CarAngle, LocationOption } from "./cars";
import { FLEET_FILES } from "./fleet.generated";

const VIDEO = /\.(mp4|webm|mov|m4v)$/i;
const IMAGE = /\.(jpe?g|png|webp|avif|gif)$/i;

export interface FolderMedia {
  files: string[];
  videos: string[];
  images: string[];
  heroVideo?: string;
  tourVideo?: string;
  poster?: string;
}

function named(files: string[], stem: string) {
  const re = new RegExp(`(?:^|/)${stem}\\.[a-z0-9]+$`, "i");
  return files.find((file) => re.test(file));
}

export function filesForCar(id: string) {
  const prefix = `/fleet/${id}/`;
  const root = `/fleet/${id}.`;
  return FLEET_FILES.filter((file) => file.startsWith(prefix) || file.startsWith(root));
}

export function readFolder(id: string): FolderMedia {
  const files = filesForCar(id);
  const videos = files.filter((file) => VIDEO.test(file));
  const images = files.filter((file) => IMAGE.test(file));
  const heroVideo = named(files, "hero") || videos[0];
  const tourVideo = named(files, "tour") || videos.find((file) => file !== heroVideo);
  const poster =
    named(files, "poster") ||
    images.find((file) => /hero/i.test(file)) ||
    images[0];
  return { files, videos, images, heroVideo, tourVideo, poster };
}

export function extraFolderIds(existingIds: Set<string>) {
  const ids = new Set<string>();
  for (const file of FLEET_FILES) {
    const match = file.match(/^\/fleet\/([^/]+)\//);
    if (!match) continue;
    const id = match[1];
    if (id === "brand" || id === "locations") continue;
    if (existingIds.has(id)) continue;
    ids.add(id);
  }
  for (const file of FLEET_FILES) {
    const match = file.match(/^\/fleet\/([^/]+)\.[a-z0-9]+$/i);
    if (!match) continue;
    const id = match[1];
    if (id === "brand" || id === "locations") continue;
    if (existingIds.has(id)) continue;
    ids.add(id);
  }
  return [...ids].filter((id) => {
    const media = readFolder(id);
    return Boolean(media.heroVideo || media.poster || media.images.length);
  });
}

export function overlayCarMedia(car: Car): Car {
  const media = readFolder(car.id);
  if (!media.heroVideo && !media.tourVideo && !media.poster && media.images.length === 0) {
    return car;
  }

  const heroImage = media.poster || media.images[0] || car.heroImage;
  const gallery = media.images.length > 0 ? media.images : car.gallery;
  const angleLookup: Record<string, string | undefined> = {
    front: named(media.files, "front") || named(media.files, "gallery-1") || media.images[0],
    side: named(media.files, "side") || named(media.files, "gallery-2") || media.images[1],
    rear: named(media.files, "rear") || named(media.files, "gallery-3") || media.images[2],
    detail: named(media.files, "detail") || named(media.files, "gallery-4") || media.images[3],
  };

  const angles: CarAngle[] = car.angles.map((angle) => ({
    ...angle,
    image: angleLookup[angle.id] || angle.image,
  }));

  return {
    ...car,
    heroVideo: media.heroVideo,
    tourVideo: media.tourVideo,
    heroImage,
    detailImage: media.poster || media.images[0] || car.detailImage,
    tourImage: media.images[1] || media.poster || car.tourImage,
    gallery,
    angles,
  };
}

export function resolveBrandMedia() {
  const files = filesForCar("brand");
  const videos = files.filter((file) => VIDEO.test(file));
  const images = files.filter((file) => IMAGE.test(file));
  return {
    intro: named(files, "intro") || videos[0],
    onboard: [
      named(files, "onboard-1") || videos[0],
      named(files, "onboard-2") || videos[1] || videos[0],
      named(files, "onboard-3") || videos[2] || videos[1] || videos[0],
    ] as Array<string | undefined>,
    poster: named(files, "poster") || images[0],
  };
}

export function resolveLocationArt(id: string, fallback: string) {
  const files = filesForCar("locations");
  return named(files, id) || files.find((file) => file.toLowerCase().includes(id)) || fallback;
}

export function applyLocationArt(location: LocationOption): LocationOption {
  return {
    ...location,
    artwork: resolveLocationArt(location.id, location.artwork),
  };
}
