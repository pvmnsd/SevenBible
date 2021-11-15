<template>
  <span class='no-selectable'>
    <span
      color='primary'
      class="text-caption text-grey verse-num"
    >

      {{ number }}

      <q-menu
        auto-close
        transition-show="jump-down"
        transition-hide="jump-up"
      >
      <q-list >

        <q-item
          clickable
          @click="$parent.$parent.$parent.$parent.$emit('toggleWindow', 'crossreferencesSearcher', true)"
        >
          <q-item-section>Искать перекрестные ссылки</q-item-section>
        </q-item>

        <q-item
          clickable
          @click="$parent.$parent.$parent.$parent.$emit('toggleWindow', 'translationsComparator', true)"
        >
          <q-item-section>Сравнить переводы</q-item-section>
        </q-item>

      </q-list>
    </q-menu>

    </span>
  </span>
</template>

<script>
export default {
  props: {number: Number}
}
</script>
