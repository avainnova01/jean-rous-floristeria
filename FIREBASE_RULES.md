# Reglas de Seguridad Recomendadas para Firebase

Para garantizar que tu aplicación sea segura y solo los administradores puedan editar el catálogo, debes configurar las siguientes reglas en tu Consola de Firebase.

---

## 1. Cloud Firestore Rules

Ve a la sección de **Firestore Database** -> **Reglas (Rules)** y pega el siguiente código:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {

    // Reglas para la colección de categorías
    match /categories/{categoryId} {
      // Cualquiera puede leer categorías activas, pero el panel administrativo necesita leer todas
      allow read: if true;
      // Solo usuarios autenticados pueden crear, editar o eliminar categorías
      allow write: if request.auth != null;
    }

    // Reglas para la colección de productos
    match /products/{productId} {
      // Cualquiera puede leer productos, pero solo usuarios autenticados escriben
      allow read: if true;
      allow write: if request.auth != null;
    }

    // Reglas para la colección de configuraciones generales
    match /settings/{settingId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

---

## 2. Firebase Storage Rules (Si aplica)

Si vas a utilizar la subida de imágenes a Firebase Storage, ve a la sección de **Storage** -> **Reglas (Rules)** y pega lo siguiente:

```javascript
rules_version = '2';

service firebase.storage {
  match /b/{bucket}/o {
    
    // Permitir a cualquiera ver las imágenes subidas de productos o categorías
    match /{allPaths=**} {
      allow read: if true;
      // Solo permitir subir o eliminar imágenes si el usuario está autenticado
      allow write: if request.auth != null;
    }
  }
}
```
