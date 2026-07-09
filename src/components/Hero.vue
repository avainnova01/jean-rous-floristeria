<script setup>
defineEmits(['scroll-to-catalog'])
</script>

<template>
  <section id="inicio" class="relative overflow-hidden bg-cream py-16 sm:py-24 lg:py-32">
    <!-- Decorative background elements -->
    <div class="absolute top-10 left-10 w-72 h-72 bg-peach-light rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob"></div>
    <div class="absolute bottom-10 right-10 w-96 h-96 bg-beige rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-2000"></div>
    
    <!-- Abstract Organic SVG Shapes (Soft Olive & Gold) -->
    <div class="absolute -right-16 top-1/4 opacity-10 pointer-events-none hidden lg:block">
      <svg width="300" height="300" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M100 0C155.228 0 200 44.7715 200 100C200 120 180 160 140 180C100 200 50 180 30 150C10 120 0 100 0 100C0 44.7715 44.7715 0 100 0Z" fill="var(--color-olive)" />
      </svg>
    </div>
    
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <div class="lg:grid lg:grid-cols-12 lg:gap-8 items-center">
        
        <!-- Text Left -->
        <div class="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-peach/30 border border-peach/50 mb-6 transition-transform hover:scale-105 duration-300">
            <span class="w-2 h-2 rounded-full bg-terracotta"></span>
            <span class="text-xs font-semibold uppercase tracking-wider text-terracotta-dark">Floristería Boutique de Diseño</span>
          </div>
          
          <h1 class="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold tracking-tight text-stone-900 leading-tight">
            Detalles florales para <br class="hidden sm:inline" />
            <span class="text-terracotta relative">
              cada momento
              <svg class="absolute left-0 bottom-0 w-full h-2 text-peach/70 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                <path d="M0,5 C30,8 70,2 100,5" stroke="currentColor" stroke-width="4" fill="none" />
              </svg>
            </span> 
            especial.
          </h1>
          
          <p class="mt-6 text-base sm:text-lg text-stone-600 font-light leading-relaxed">
            Ramos, arreglos y diseños personalizados hechos con amor para regalar emociones. Nos inspiramos en los tonos de la naturaleza para dar vida a composiciones únicas que trascienden palabras.
          </p>
          
          <div class="mt-10 sm:flex sm:justify-center lg:justify-start gap-4">
            <button 
              @click="$emit('scroll-to-catalog')"
              class="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 border border-transparent text-base font-semibold rounded-full text-white bg-terracotta hover:bg-terracotta-dark shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 cursor-pointer"
            >
              Ver catálogo
            </button>
            <a 
              href="https://wa.me/573000000000?text=Hola%20Jean%20Rous%20Florister%C3%ADa,%20me%20gustar%C3%ADa%20solicitar%20un%20arreglo%20personalizado."
              target="_blank"
              class="mt-3 sm:mt-0 w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 border border-gold/60 text-base font-semibold rounded-full text-stone-800 bg-white/70 hover:bg-white hover:border-gold shadow-sm hover:shadow transition-all duration-300 hover:-translate-y-0.5"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-[#25D366] fill-current" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.73-1.45L0 24zm6.08-4.149c1.661.989 3.29 1.487 4.909 1.488 5.485-.002 9.945-4.461 9.949-9.947.002-2.657-1.03-5.155-2.906-7.033C16.314 2.483 13.82 1.45 11.168 1.45c-5.485 0-9.946 4.46-9.95 9.948-.002 1.93.504 3.633 1.47 5.267l-.999 3.649 3.737-.981zm13.16-5.14c-.33-.165-1.951-.963-2.251-1.072-.3-.11-.52-.165-.74.165-.22.33-.85 1.072-1.04 1.29-.19.22-.38.24-.71.075-.33-.165-1.393-.513-2.653-1.637-.98-.874-1.64-1.953-1.832-2.28-.19-.33-.02-.507.144-.672.15-.148.33-.385.496-.578.165-.19.22-.33.33-.55.11-.22.05-.412-.025-.578-.075-.165-.74-1.782-1.012-2.44-.267-.643-.539-.556-.74-.566-.19-.01-.41-.01-.63-.01-.22 0-.58.08-.88.41-.3.33-1.15 1.127-1.15 2.75 0 1.62 1.18 3.19 1.34 3.41.165.22 2.328 3.555 5.637 4.98.787.34 1.4.54 1.88.697.79.25 1.51.215 2.08.13.634-.09 1.951-.798 2.227-1.57.275-.77.275-1.43.193-1.57-.083-.14-.303-.225-.634-.39z"/>
              </svg>
              Pedir por WhatsApp
            </a>
          </div>
        </div>
        
        <!-- Image Right -->
        <div class="mt-12 sm:mt-16 lg:mt-0 lg:col-span-6 flex justify-center">
          <div class="relative w-full max-w-md sm:max-w-lg lg:max-w-none">
            <!-- Background Frame decorative -->
            <div class="absolute inset-0 bg-gradient-to-tr from-peach to-gold opacity-30 rounded-[2.5rem] transform rotate-3 scale-95 md:scale-100"></div>
            
            <div class="relative bg-white p-4 rounded-[2.5rem] shadow-xl border border-beige/40 overflow-hidden hover:scale-[1.02] transition-transform duration-500">
              <img 
                src="https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=800&q=80" 
                alt="Elegante arreglo floral Jean Rous" 
                class="w-full h-[400px] object-cover rounded-[1.8rem]"
              />
              
              <!-- Floating label -->
              <div class="absolute bottom-8 right-8 bg-cream/95 backdrop-blur-md px-6 py-3 rounded-2xl border border-gold/30 shadow-lg flex items-center gap-3">
                <div class="w-8 h-8 rounded-full bg-terracotta flex items-center justify-center text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p class="text-[10px] text-olive font-bold uppercase tracking-wider">Envío Seguro</p>
                  <p class="text-xs text-stone-800 font-semibold font-serif">100% Programado</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </section>
</template>

<style scoped>
@keyframes blob {
  0% { transform: translate(0px, 0px) scale(1); }
  33% { transform: translate(30px, -50px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.95); }
  100% { transform: translate(0px, 0px) scale(1); }
}
.animate-blob {
  animation: blob 7s infinite alternate;
}
.animation-delay-2000 {
  animation-delay: 2s;
}
</style>
