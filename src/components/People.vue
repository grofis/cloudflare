<template>
    <a-list :grid="{ gutter: 16, column: 2 }" :data-source="data">
      <template #renderItem="{ item }">
        <a-list-item>
          <a-card :title="item.title">Card content</a-card>
        </a-list-item>
      </template>
    </a-list>
  </template>
  <script setup>
  const data = [
    {
      title: 'Title 1',
    },
    {
      title: 'Title 2',
    },
    {
      title: 'Title 3',
    },
    {
      title: 'Title 4',
    },
  ];
  </script>