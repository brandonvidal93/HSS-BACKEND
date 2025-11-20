# HolySeeSoftware: Plataforma de Gestión Eclesial 1.0
Plataforma integral web para la gestión administrativa, financiera y de comunidad de iglesias en Colombia.

## 1. Requisitos del Sistema
Esta aplicación backend fue desarrollada bajo una Arquitectura por Capas y está diseñada para manejar sistemas transaccionales CRUD.

### 1.1 Tecnologías Utilizadas
- Lenguaje: TypeScript (5.x)
- Servidor: Node.js / Express
- Base de Datos: PostgreSQL (Relacional)
- Conexión a BD: pg (Pool de Conexiones)

### 1.2 Dependencias Obligatorias
- Asegúrese de tener instalados:
- Node.js: Versión 18 o superior.
- PostgreSQL: Un servidor de base de datos en ejecución.
- Credenciales: El archivo `.env` configurado.

## 2. Arquitectura del Proyecto
El proyecto utiliza una Arquitectura por Capas (N-Capas), considerada el estándar para sistemas de información transaccionales.

### 2.1 Estilo Arquitectónico Principal
| Estilo  | Justificación  |
|---|---|
| Arquitectura por Capas  | Permite la separación estricta de responsabilidades (Lógica de Negocio, Dominio, Persistencia), garantizando mantenibilidad y fácil testeo. Es ideal para el flujo secuencial de transacciones CRUD  |

### 2.2 Principios SOLID Aplicados
- Responsabilidad Única (S): Cada clase (Servicio, Repositorio, Controlador) tiene una única razón para cambiar. Los Servicios solo manejan lógica de negocio; los Repositorios solo manejan SQL/Persistencia.
- Abierto/Cerrado (O): El sistema está abierto a extensión pero cerrado a modificación, especialmente evidente en el Patrón Strategy (para pagos, no implementado en esta versión).
- Inversión de Dependencias (D): La capa de negocio (`GestionMiembroService`) solo depende de abstracciones (`MiembroRepository` - la interfaz de Dominio) y no de implementaciones concretas de la DB (`PgMiembroRepository`). Esto facilita la prueba unitaria con Mocks.

### 2.3 Patrones de Diseño Implementados
Este proyecto implementa patrones críticos en la capa de negocio y acceso a datos.
- Repository: Abstrae la lógica de acceso a datos, facilitando el cambio de DB (PostgreSQL a Mongo, por ejemplo) sin afectar la lógica de negocio.
- Service: Centraliza y coordina la lógica de negocio, asegurando la consistencia del dominio (ej. GestionMiembroService).
- Factory Method: Encapsula la lógica de creación de entidades (MiembroFactory), asegurando que todos los objetos se construyan cumpliendo las reglas iniciales de negocio.
- Strategy: (Planificado en el módulo de Aportes) Permite intercambiar algoritmos (ej. `PayUStrategy`, `MercadoPagoStrategy`) sin modificar el código consumidor (`PaymentProcessor`).
- bserver: (Planificado) Desacopla la acción principal (ej. registrar aporte) de las reacciones secundarias (ej. enviar notificación o auditoría).

## 3. Instrucciones de Instalación y Ejecución
Siga estos pasos para configurar y ejecutar el proyecto localmente.

### 3.1 Clonar el Repositorio
```bash 
  git clone https://github.com/brandonvidal93/HSS-BACKEND.git
  cd HSS-BACKEND
```

### 3.2 Instalar Dependencias:
```bash
  npm install
```

### 3.3 Configurar Variables de Entorno
Cree un archivo `.env` en la raíz del proyecto con la siguiente estructura (reemplace los corchetes con sus valores):
```
PORT=3000

# CONFIGURACIÓN DE POSTGRESQL
DB_HOST=localhost
DB_PORT=5432
DB_USER=[SU_USUARIO_DB]
DB_PASSWORD=[SU_CLAVE_DB]
DB_NAME=holyseedb
```

### 3.4 Configuración de la Base de Datos
Debe crear las tablas requeridas por los repositorios.

1. Cree la Base de Datos: Conéctese a su servidor PostgreSQL y cree la base de datos `holyseedb`.
2. Ejecute el Script SQL: Ejecute el script SQL consolidado que crea las tablas `templos`, `pastores`, `miembros`, `comites` y `usuarios`. **Se debe respetar el orden de creación para mantener las relaciones de clave foránea.**
2.1. *Nota: Si ya ejecutó el script y las tablas existen, omita este paso.*

### 3.5 Iniciar el Servidor
Use `ts-node-dev` para compilar y ejecutar automáticamente en modo desarrollo:
```bash
  npm run dev
```
El servidor debe iniciarse en `http://localhost:3000/api`.

## 4. Prueba de Flujos Funcionales (CRUD)
Para probar la integridad de la Capa de Negocio y la Persistencia, utilice un cliente HTTP (Postman/Insomnia) en las rutas públicas.

### 4.1. Flujo 1: Templo (Dependencia 1)
Ruta: `/api/templos/`

| Método  | Endpoint  | Descripción  |
|---|---|---|
| POST  | /api/templos/  | Registra el primer templo (necesario para la FK de Miembros).  |

**RAW Body (POST Templo):**
```json
{
  "nombre": "Palermo de Medellín",
  "direccion": "Cra. 54 #91-65, Aranjuez, Medellín, Antioquia",
  "ciudad": "Medellín",
  "departamento": "Antioquia",
  "pais": "Colombia",
  "fechaFundacion": "1995-10-20"
  // pastorPrincipalId se puede omitir en el registro inicial o dejar como null,
  // ya que la asignación se suele hacer después de registrar al Pastor.
}
```

### 4.2. Flujo Principal: Miembro
Ruta: `/api/miembros/`

| Método  | Endpoint  | Descripción  |
|---|---|---|
| POST  | /api/miembros/  | Crea un nuevo miembro.  |
| GET | /api/miembros/ | Obtiene la lista de todos los miembros. |
| PUT | /api/miembros/[ID] | Actualiza campos de un miembro existente. |

**RAW Body (POST Miembro):**
```json
{
  "nombres": "Ana María",
  "apellidos": "Restrepo",
  "fechaNacimiento": "1998-04-12",
  "telefono": "3109876543",
  "email": "ana.restrepo@miembro.com",
  "estado": "BAUTIZADO",
  "fechaRegistro": "2025-11-19",
  "fechaBautismo": "2000-06-06",
  "activo": true,
  "temploId": "[ID DEL TEMPLO]"
}
``` 

### 4.3. Flujo 2: Pastor
Ruta: `/api/pastores/`

| Método  | Endpoint  | Descripción  |
|---|---|---|
| POST  | /api/pastores/  | Crea un nuevo pastor.  |
| PUT | /api/pastores/[ID]/asignar-templo | Asigna un templo al pastor. |

**RAW Body (POST Pastor):**
```json
{
  "nombre": "Carlos",
  "apellido": "Gonzalez",
  "telefono": "3001234567",
  "correo": "carlos@holysee.com",
  "fechaNacimiento": "1975-01-25",
  "fechaOrdenacion": "2005-08-10",
  "licenciaMinisterial": "LIC-PR-00123",
  "estado": "ACTIVO",
  "temploId": "[ID DEL TEMPLO]"
}
``` 

### 4.4. Flujo 3: Comité
Ruta: `/api/comites/`

| Método  | Endpoint  | Descripción  |
|---|---|---|
| POST  | /api/comites/  | Crea un nuevo comité.  |
| PUT | /api/comites/[ID]/asignar-lider | Asigna un Miembro como líder del comité. |

**RAW Body (POST Pastor):**
```json
{
  "nombre": "Comité de Música",
  "descripcion": "Encargado de la logística musical y adoración en los eventos.",
  "fechaCreacion": "2020-06-06",
  "temploId": "[ID DEL TEMPLO]",
  "liderId": "[ID DEL MIEMBRO]" 
}
```