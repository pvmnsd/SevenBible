import {InjectionKey} from 'vue'
import {Bible} from "src/types/store/bible";
import {Ref} from 'vue'
import {Popup} from "src/hooks/usePopupWindows";

export const id_: InjectionKey<number> = Symbol('id')
export const bible_: InjectionKey<Ref<Bible>> = Symbol('bible')
export const popup_ : InjectionKey<Popup> = Symbol('popup')
