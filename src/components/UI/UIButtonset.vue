<template>
  <div
    @wheel.prevent="horizontalScrollOnWheel($event, $refs.topBar)"
    ref="topBar"
    class='top-bar flex full-width overflow-hidden shrink-0'
  >
    <slot/>
  </div>
</template>

<script setup>
import {horizontalScrollOnWheel} from "src/hooks/HorizontalScrollOnWheel";
</script>
