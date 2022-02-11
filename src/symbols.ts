import {InjectionKey} from 'vue'
import {Bible} from "src/types/store/bible";
import {Ref} from 'vue'
import {Popup} from "src/hooks/usePopupWindows";
import {BibleInfo} from "src-electron/types/bible";

export const id_: InjectionKey<number> = Symbol('id')
export const bible_: InjectionKey<Ref<Bible>> = Symbol('bible')
export const popup_: InjectionKey<Popup> = Symbol('popup')
export const bibleModuleInfo_: InjectionKey<Ref<BibleInfo>> = Symbol('bibleModuleInfo')
export const bookFullName_: InjectionKey<Ref<string>> = Symbol('bookFullName')
export const bookShortName_: InjectionKey<Ref<string>> = Symbol('bookShortName')
