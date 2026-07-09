<script setup>
const WHATSAPP_NUMBER = "573000000000"
const message = encodeURIComponent("Hola Jean Rous Floristería, me gustaría recibir asesoría para cotizar un arreglo personalizado.")
const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`
</script>

<template>
  <section class="bg-terracotta relative overflow-hidden py-12 px-6 sm:py-16 sm:px-12 lg:px-24">
    <!-- Decorative faint leaves pattern in background -->
    <div class="absolute inset-0 opacity-5 mix-blend-overlay pointer-events-none">
      <svg class="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <pattern id="leaf-pattern" width="60" height="60" patternUnits="userSpaceOnUse">
          <path d="M30 0 C40 15 40 30 30 60 C20 30 20 15 30 0" fill="none" stroke="white" stroke-width="2"/>
        </pattern>
        <rect width="100%" height="100%" fill="url(#leaf-pattern)" />
      </svg>
    </div>
    
    <div class="max-w-5xl mx-auto text-center relative z-10">
      <h2 class="text-2xl sm:text-3xl lg:text-4xl font-serif text-white leading-relaxed font-bold">
        “Arreglos personalizados para amor, fechas especiales, novias, condolencias y celebraciones.”
      </h2>
      <p class="mt-4 text-peach-light/80 text-sm sm:text-base font-light tracking-wide max-w-2xl mx-auto">
        Platícanos tu idea, los colores que deseas y las flores de tu preferencia. Diseñamos algo único a tu medida.
      </p>
      <div class="mt-8">
        <a 
          :href="whatsappUrl" 
          target="_blank"
          class="inline-flex items-center px-8 py-3.5 border-2 border-white text-base font-semibold rounded-full text-white hover:bg-white hover:text-terracotta shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 fill-current" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.73-1.45L0 24zm6.08-4.149c1.661.989 3.29 1.487 4.909 1.488 5.485-.002 9.945-4.461 9.949-9.947.002-2.657-1.03-5.155-2.906-7.033C16.314 2.483 13.82 1.45 11.168 1.45c-5.485 0-9.946 4.46-9.95 9.948-.002 1.93.504 3.633 1.47 5.267l-.999 3.649 3.737-.981zm13.16-5.14c-.33-.165-1.951-.963-2.251-1.072-.3-.11-.52-.165-.74.165-.22.33-.85 1.072-1.04 1.29-.19.22-.38.24-.71.075-.33-.165-1.393-.513-2.653-1.637-.98-.874-1.64-1.953-1.832-2.28-.19-.33-.02-.507.144-.672.15-.148.33-.385.496-.578.165-.19.22-.33.33-.55.11-.22.05-.412-.025-.578-.075-.165-.74-1.782-1.012-2.44-.267-.643-.539-.556-.74-.566-.19-.01-.41-.01-.63-.01-.22 0-.58.08-.88.41-.3.33-1.15 1.127-1.15 2.75 0 1.62 1.18 3.19 1.34 3.41.165.22 2.328 3.555 5.637 4.98.787.34 1.4.54 1.88.697.79.25 1.51.215 2.08.13.634-.09 1.951-.798 2.227-1.57.275-.77.275-1.43.193-1.57-.083-.14-.303-.225-.634-.39z"/>
          </svg>
          Cotizar arreglo personalizado
        </a>
      </div>
    </div>
  </section>
</template>
