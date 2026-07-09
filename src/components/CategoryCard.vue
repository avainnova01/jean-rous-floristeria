<script setup>
const props = defineProps({
  category: {
    type: Object,
    required: true
  },
  isSelected: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['select-category'])
</script>

<template>
  <div 
    @click="emit('select-category', category.id)"
    :class="[
      'group relative flex flex-col justify-end overflow-hidden rounded-[2rem] bg-stone-100 transition-all duration-500 cursor-pointer border-2 h-96 hover:shadow-xl hover:-translate-y-1.5',
      isSelected ? 'border-terracotta ring-4 ring-terracotta/20 shadow-lg' : 'border-beige hover:border-peach'
    ]"
  >
    <!-- Background Image with Zoom on Hover -->
    <div class="absolute inset-0 z-0">
      <img 
        :src="category.image" 
        :alt="category.name" 
        class="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
      />
      <!-- Gradient overlay for text legibility -->
      <div class="absolute inset-0 bg-gradient-to-t from-stone-900/90 via-stone-900/40 to-transparent"></div>
    </div>

    <!-- Content Overlaid -->
    <div class="relative z-10 p-6 sm:p-8 flex flex-col justify-end h-full">
      <div class="mb-2">
        <span 
          v-if="isSelected"
          class="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-terracotta text-white mb-2 shadow-sm animate-pulse"
        >
          Filtro Activo
        </span>
      </div>
      
      <h3 class="text-2xl font-serif font-bold text-white mb-2 group-hover:text-peach transition-colors duration-300">
        {{ category.name }}
      </h3>
      
      <p class="text-cream/90 text-sm font-light leading-relaxed mb-6 line-clamp-2 opacity-90 group-hover:opacity-100 transition-opacity">
        {{ category.description }}
      </p>

      <div class="flex items-center justify-between">
        <button 
          class="inline-flex items-center text-xs font-semibold uppercase tracking-wider text-peach group-hover:text-white transition-colors duration-300"
        >
          Ver arreglos
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1.5 transform transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>
