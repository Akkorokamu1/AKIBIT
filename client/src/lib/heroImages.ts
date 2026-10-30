import { netlifyTarget } from "./deployment";

// The Netlify edition only uses verified, completed files checked into public/art.
const portableStudio = "/art/akibit-studio.webp";
const portableArcade = "/art/akibit-arcade.webp";

export const heroImages = {
  studio: netlifyTarget
    ? portableStudio
    : "/manus-storage/async-images/RMovyTZsZL6hKDd8dFYxhg/image-1.webp",
  arcade: netlifyTarget
    ? portableArcade
    : "/manus-storage/async-images/RMovyTZsZL6hKDd8dFYxhg/image-2.webp",
};
