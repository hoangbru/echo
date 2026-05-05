import ISO6391 from "iso-639-1";

export const MUSIC_LANGUAGES = [
  { code: "vi", name: "Tiếng Việt" },
  { code: "en", name: "Tiếng Anh" },
  { code: "ko", name: "Tiếng Hàn" },
  { code: "ja", name: "Tiếng Nhật" },
  { code: "zh", name: "Tiếng Trung" },
  { code: "es", name: "Tiếng Tây Ban Nha" },
  { code: "fr", name: "Tiếng Pháp" },
  { code: "th", name: "Tiếng Thái" },
  { code: "ru", name: "Tiếng Nga" },
  { code: "de", name: "Tiếng Đức" },
  { code: "it", name: "Tiếng Ý" },
  { code: "pt", name: "Tiếng Bồ Đào Nha" },
  { code: "id", name: "Tiếng Indonesia" },
  { code: "hi", name: "Tiếng Hindi" },
  { code: "ar", name: "Tiếng Ả Rập" },
  { code: "other", name: "Khác" },
];

export type LanguageOption = {
  code: string;
  name: string;
};

const viNames = new Intl.DisplayNames(["vi"], { type: "language" });

export const allLanguages: LanguageOption[] = ISO6391.getAllCodes().map(
  (code) => {
    let translatedName = viNames.of(code) || ISO6391.getName(code);

    translatedName =
      translatedName.charAt(0).toUpperCase() + translatedName.slice(1);

    return {
      code,
      name: translatedName,
    };
  },
);
