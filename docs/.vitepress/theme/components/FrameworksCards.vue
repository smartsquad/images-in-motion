<script setup lang="ts">
import { withBase } from 'vitepress'
import { EFrameworkGuides } from '../../frameworks'

function hrefFor(link: string) {
  return withBase(`${link}.html`)
}
</script>

<template>
  <div class="frameworks-cards">
    <a
      v-for="card in EFrameworkGuides"
      :key="card.link"
      class="frameworks-cards__item"
      :href="hrefFor(card.link)"
    >
      <span class="frameworks-cards__title">
        <span
          class="nf fw-icon frameworks-cards__icon"
          :class="`fw-icon--${card.id}`"
          aria-hidden="true"
        >{{ card.icon }}</span>
        <strong>{{ card.text }}</strong>
      </span>
      <span class="frameworks-cards__detail">{{ card.detail }}</span>
    </a>
  </div>
</template>
