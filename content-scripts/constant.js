const START_TRANSLATE = 'start.translate';
const FINISH_TRANSLATE = 'finish.translate';
const GOOGLE_TRANS_ROOT_URL = 'https://translate.google.com/#view=home&op=translate&sl=auto&tl=&text=';
const DEFAULT_ERROR_TEXT = 'Translation result is not available yet. The reason is probably either of internet connection, or the delay of the first time opening Google Translate Tab. Please try again!';
const WAITING_TEXT = 'Please wait, translation is being processed...'
const NOT_YET_PICK_TRANSLATE_LANGUAGE_ERROR_TEXT = 'After you select a translated language, try again by clicking at the source text on the left, this message will be replaced by translated result.';
const sourceLanguageKey = 'sourceLanguage';
const CURRENT_TRANSLATED_TEXT_KEY  = 'current-translated-text';
const APP_STATE_KEY = 'smartcat-translation-helper-state';
const APP_STATE_ON = 1;
const APP_STATE_OFF = 0;
const translateLanguageKey = 'translatedLanguage';
const OPEN_POPUP_MSG = 'open-popup';
const ADDITIONAL_REQUEST_URL = 'https://ea.smartcat.ai/api/SpellCheck/SplitIntoWords';
const DEBUG = 1;
