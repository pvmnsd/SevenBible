<template>
  <suspense>
    <transition-group name="fade">
      <book-selector
        v-if="transitions.bookSelector"
        key="book-selector"
        :text-directions="textDirections"
        :book-full-name="bookFullName"
      />

      <text-searcher
        v-if="transitions.bookSearcher"
        key="text-searcher"
      />
      <strong-searcher
        :strong-numbers-prefix="strongNumbersPrefix"
        v-if="transitions.strongSearcher"
        key="strong-searcher"
      />

      <crossreferences-searcher
        v-if="transitions.crossreferencesSearcher"
        key="crossreferences-searcher"
        :book-short-name="bookShortName"
        :text-directions="textDirections"
      />
      <translations-comparator
        v-if="transitions.translationsComparator"
        key="translations-comparator"
        :book-short-name="bookShortName"
      />

      <subheadings-settings
        v-if="transitions.subheadingsSettings"
        key="subheadings-settings"
      />

      <commentaries-settings
        v-if="transitions.commentariesSettings"
        key="commentaries-settings"
      />
    </transition-group>
  </suspense>
</template>

<script>
import TranslationsComparator from "components/bible/transitions/translationsComparator";
import CommentariesSettings from "components/bible/transitions/commentariesSettings";
import SubheadingsSettings from "components/bible/transitions/subheadingsSettings";
import CrossreferencesSearcher from "components/bible/transitions/crossreferencesSearcher";
import StrongSearcher from "components/bible/transitions/strongSearcher";
import TextSearcher from "components/bible/transitions/textSearcher";
import BookSelector from "components/bible/transitions/bookSelector";

export default {
  components: {
    TranslationsComparator,
    CommentariesSettings,
    SubheadingsSettings,
    CrossreferencesSearcher,
    StrongSearcher,
    TextSearcher,
    BookSelector
  },
  props: {
    textDirections: Object,
    transitions: Object,
    bookShortName: String,
    bookFullName: String,
    strongNumbersPrefix: String
  }
}
</script>
