/*
 Navicat Premium Dump SQL

 Source Server         : local postgres
 Source Server Type    : PostgreSQL
 Source Server Version : 170004 (170004)
 Source Host           : localhost:5432
 Source Catalog        : asistencia_escolar
 Source Schema         : public

 Target Server Type    : PostgreSQL
 Target Server Version : 170004 (170004)
 File Encoding         : 65001

 Date: 17/05/2025 12:54:44
*/


-- ----------------------------
-- Table structure for alumnos
-- ----------------------------
DROP TABLE IF EXISTS "public"."alumnos";
CREATE TABLE "public"."alumnos" (
  "id_alumno" uuid NOT NULL DEFAULT uuid_generate_v4(),
  "nombres" varchar(60) COLLATE "pg_catalog"."default" NOT NULL,
  "apellidos" varchar(60) COLLATE "pg_catalog"."default" NOT NULL,
  "fecha_nacimiento" date NOT NULL,
  "direccion" varchar(500) COLLATE "pg_catalog"."default",
  "telefono" varchar(20) COLLATE "pg_catalog"."default",
  "email" varchar(50) COLLATE "pg_catalog"."default",
  "created_at" timestamp(6) DEFAULT CURRENT_TIMESTAMP
)
;

-- ----------------------------
-- Records of alumnos
-- ----------------------------
INSERT INTO "public"."alumnos" VALUES ('b0a3769a-b931-450c-9191-436010002283', 'Yohalmo', 'Vasquez', '2001-02-01', 'Sonsonate', '123456789', 'pruebaprueba.com', '2025-05-16 17:38:12.880273');

-- ----------------------------
-- Table structure for asistencias
-- ----------------------------
DROP TABLE IF EXISTS "public"."asistencias";
CREATE TABLE "public"."asistencias" (
  "id_asistencia" uuid NOT NULL DEFAULT uuid_generate_v4(),
  "fecha" date NOT NULL,
  "estado" varchar(20) COLLATE "pg_catalog"."default" DEFAULT 'AUSENTE'::character varying,
  "id_alumno" uuid NOT NULL,
  "id_materia" uuid NOT NULL,
  "id_motivo" uuid,
  "created_at" timestamp(6) DEFAULT CURRENT_TIMESTAMP
)
;

-- ----------------------------
-- Records of asistencias
-- ----------------------------
INSERT INTO "public"."asistencias" VALUES ('0d3ddb46-ebe1-4868-8d98-adfdc6ec436a', '2025-05-15', 'AUSENTE', 'b0a3769a-b931-450c-9191-436010002283', 'bdb174b7-2e8c-46fd-b7d4-f889f1007c25', NULL, '2025-05-16 17:38:21.686454');

-- ----------------------------
-- Table structure for cursos
-- ----------------------------
DROP TABLE IF EXISTS "public"."cursos";
CREATE TABLE "public"."cursos" (
  "id_curso" uuid NOT NULL DEFAULT uuid_generate_v4(),
  "nombre" varchar(50) COLLATE "pg_catalog"."default" NOT NULL,
  "descripcion" varchar(250) COLLATE "pg_catalog"."default" NOT NULL,
  "estado" varchar(10) COLLATE "pg_catalog"."default",
  "id_periodo" uuid NOT NULL,
  "created_at" timestamp(6) DEFAULT CURRENT_TIMESTAMP
)
;

-- ----------------------------
-- Records of cursos
-- ----------------------------
INSERT INTO "public"."cursos" VALUES ('14617a38-09a4-42de-9861-f40f73356157', 'Primer curso', 'descripcion del primer curso', 'ACTIVO', 'fbd3ca3a-f127-4e53-a155-525fc2236259', '2025-05-16 17:38:28.637765');

-- ----------------------------
-- Table structure for cursos_alumno
-- ----------------------------
DROP TABLE IF EXISTS "public"."cursos_alumno";
CREATE TABLE "public"."cursos_alumno" (
  "id_curso" uuid NOT NULL,
  "id_alumno" uuid NOT NULL,
  "fecha_inscripcion" date NOT NULL
)
;

-- ----------------------------
-- Records of cursos_alumno
-- ----------------------------

-- ----------------------------
-- Table structure for materias
-- ----------------------------
DROP TABLE IF EXISTS "public"."materias";
CREATE TABLE "public"."materias" (
  "id_materia" uuid NOT NULL DEFAULT uuid_generate_v4(),
  "nombre" varchar(50) COLLATE "pg_catalog"."default" NOT NULL,
  "descripcion" varchar(250) COLLATE "pg_catalog"."default",
  "created_at" timestamp(6) DEFAULT CURRENT_TIMESTAMP
)
;

-- ----------------------------
-- Records of materias
-- ----------------------------
INSERT INTO "public"."materias" VALUES ('bdb174b7-2e8c-46fd-b7d4-f889f1007c25', 'Ingles', NULL, '2025-05-16 17:38:36.264262');

-- ----------------------------
-- Table structure for materias_curso
-- ----------------------------
DROP TABLE IF EXISTS "public"."materias_curso";
CREATE TABLE "public"."materias_curso" (
  "id_materiacurso" uuid NOT NULL DEFAULT uuid_generate_v4(),
  "horario" time(6) NOT NULL,
  "id_curso" uuid NOT NULL,
  "id_materia" uuid NOT NULL,
  "id_profesor" uuid NOT NULL,
  "id_salon" uuid NOT NULL
)
;

-- ----------------------------
-- Records of materias_curso
-- ----------------------------

-- ----------------------------
-- Table structure for motivos_ausencia
-- ----------------------------
DROP TABLE IF EXISTS "public"."motivos_ausencia";
CREATE TABLE "public"."motivos_ausencia" (
  "id_motivo" uuid NOT NULL DEFAULT uuid_generate_v4(),
  "descripcion" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "created_at" timestamp(6) DEFAULT CURRENT_TIMESTAMP
)
;

-- ----------------------------
-- Records of motivos_ausencia
-- ----------------------------
INSERT INTO "public"."motivos_ausencia" VALUES ('7950bd59-f365-4002-8880-8e2ca71362b6', 'Prueba de ausencia', '2025-05-16 17:38:57.287453');

-- ----------------------------
-- Table structure for periodos
-- ----------------------------
DROP TABLE IF EXISTS "public"."periodos";
CREATE TABLE "public"."periodos" (
  "id_periodo" uuid NOT NULL DEFAULT uuid_generate_v4(),
  "nombre" varchar(50) COLLATE "pg_catalog"."default" NOT NULL,
  "fecha_inicio" date NOT NULL,
  "fecha_finalizacion" date,
  "created_at" timestamp(6) DEFAULT CURRENT_TIMESTAMP
)
;

-- ----------------------------
-- Records of periodos
-- ----------------------------
INSERT INTO "public"."periodos" VALUES ('fbd3ca3a-f127-4e53-a155-525fc2236259', 'Primer periodo', '2025-04-30', '2025-05-15', '2025-05-16 17:39:02.178833');

-- ----------------------------
-- Table structure for profesores
-- ----------------------------
DROP TABLE IF EXISTS "public"."profesores";
CREATE TABLE "public"."profesores" (
  "id_profesor" uuid NOT NULL DEFAULT uuid_generate_v4(),
  "nombres" varchar(60) COLLATE "pg_catalog"."default" NOT NULL,
  "apellidos" varchar(60) COLLATE "pg_catalog"."default" NOT NULL,
  "especialidad" varchar(100) COLLATE "pg_catalog"."default",
  "telefono" varchar(20) COLLATE "pg_catalog"."default",
  "email" varchar(50) COLLATE "pg_catalog"."default",
  "documento_identificacion" varchar(20) COLLATE "pg_catalog"."default",
  "created_at" timestamp(6) DEFAULT CURRENT_TIMESTAMP
)
;

-- ----------------------------
-- Records of profesores
-- ----------------------------
INSERT INTO "public"."profesores" VALUES ('7bc61066-23d2-4249-a90a-6d786f81c5aa', 'Profesor', 'Unico', 'Math', '123456789', 'profesor@uso.com', '123456789', '2025-05-17 18:46:11.728511');

-- ----------------------------
-- Table structure for reportes
-- ----------------------------
DROP TABLE IF EXISTS "public"."reportes";
CREATE TABLE "public"."reportes" (
  "id_reporte" uuid NOT NULL DEFAULT uuid_generate_v4(),
  "fecha" date NOT NULL,
  "observaciones" text COLLATE "pg_catalog"."default" NOT NULL,
  "id_alumno" uuid NOT NULL,
  "id_periodo" uuid NOT NULL,
  "created_at" timestamp(6) DEFAULT CURRENT_TIMESTAMP
)
;

-- ----------------------------
-- Records of reportes
-- ----------------------------
INSERT INTO "public"."reportes" VALUES ('2d821874-8950-42b0-9467-b9f88340c36d', '2025-05-15', 'Prueba reporte', 'b0a3769a-b931-450c-9191-436010002283', 'fbd3ca3a-f127-4e53-a155-525fc2236259', '2025-05-16 17:39:06.87335');

-- ----------------------------
-- Table structure for salones
-- ----------------------------
DROP TABLE IF EXISTS "public"."salones";
CREATE TABLE "public"."salones" (
  "id_salon" uuid NOT NULL DEFAULT uuid_generate_v4(),
  "nombre" varchar(50) COLLATE "pg_catalog"."default" NOT NULL,
  "capacidad" int4 NOT NULL,
  "ubicacion" varchar(200) COLLATE "pg_catalog"."default" NOT NULL,
  "observaciones" varchar(250) COLLATE "pg_catalog"."default",
  "created_at" timestamp(6) DEFAULT CURRENT_TIMESTAMP
)
;

-- ----------------------------
-- Records of salones
-- ----------------------------
INSERT INTO "public"."salones" VALUES ('9446d95f-2cb7-4ff8-af22-a2d92d7c006b', 'Primer salon', 15, 'Primer edificio', NULL, '2025-05-17 18:45:34.335189');

DROP TABLE IF EXISTS "public"."telefonos";
CREATE TABLE "public"."telefonos" (
    id_telefono UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    numero_telefono VARCHAR(20) NOT NULL,
    nombre VARCHAR(100),
    codigo_pais VARCHAR(10)
);

DROP TABLE IF EXISTS "public"."notificaciones";
CREATE TABLE "public"."notificaciones" (
  "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
  "id_alumno" uuid,
  "fecha_envio" timestamp(6) DEFAULT CURRENT_TIMESTAMP,
  "estado" varchar(255) not null
)
;

-- ----------------------------
-- Checks structure for table notificaciones
-- ----------------------------
ALTER TABLE "public"."notificaciones" ADD CONSTRAINT "notificaciones_estado_check" CHECK (estado = ANY (ARRAY['Pendiente'::text, 'Enviado'::text, 'Fallido'::text]));

-- ----------------------------
-- Primary Key structure for table notificaciones
-- ----------------------------
ALTER TABLE "public"."notificaciones" ADD CONSTRAINT "notificaciones_pkey" PRIMARY KEY ("id");


-- ----------------------------
-- Function structure for uuid_generate_v1
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."uuid_generate_v1"();
CREATE FUNCTION "public"."uuid_generate_v1"()
  RETURNS "pg_catalog"."uuid" AS '$libdir/uuid-ossp', 'uuid_generate_v1'
  LANGUAGE c VOLATILE STRICT
  COST 1;

-- ----------------------------
-- Function structure for uuid_generate_v1mc
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."uuid_generate_v1mc"();
CREATE FUNCTION "public"."uuid_generate_v1mc"()
  RETURNS "pg_catalog"."uuid" AS '$libdir/uuid-ossp', 'uuid_generate_v1mc'
  LANGUAGE c VOLATILE STRICT
  COST 1;

-- ----------------------------
-- Function structure for uuid_generate_v3
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."uuid_generate_v3"("namespace" uuid, "name" text);
CREATE FUNCTION "public"."uuid_generate_v3"("namespace" uuid, "name" text)
  RETURNS "pg_catalog"."uuid" AS '$libdir/uuid-ossp', 'uuid_generate_v3'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;

-- ----------------------------
-- Function structure for uuid_generate_v4
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."uuid_generate_v4"();
CREATE FUNCTION "public"."uuid_generate_v4"()
  RETURNS "pg_catalog"."uuid" AS '$libdir/uuid-ossp', 'uuid_generate_v4'
  LANGUAGE c VOLATILE STRICT
  COST 1;

-- ----------------------------
-- Function structure for uuid_generate_v5
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."uuid_generate_v5"("namespace" uuid, "name" text);
CREATE FUNCTION "public"."uuid_generate_v5"("namespace" uuid, "name" text)
  RETURNS "pg_catalog"."uuid" AS '$libdir/uuid-ossp', 'uuid_generate_v5'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;

-- ----------------------------
-- Function structure for uuid_nil
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."uuid_nil"();
CREATE FUNCTION "public"."uuid_nil"()
  RETURNS "pg_catalog"."uuid" AS '$libdir/uuid-ossp', 'uuid_nil'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;

-- ----------------------------
-- Function structure for uuid_ns_dns
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."uuid_ns_dns"();
CREATE FUNCTION "public"."uuid_ns_dns"()
  RETURNS "pg_catalog"."uuid" AS '$libdir/uuid-ossp', 'uuid_ns_dns'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;

-- ----------------------------
-- Function structure for uuid_ns_oid
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."uuid_ns_oid"();
CREATE FUNCTION "public"."uuid_ns_oid"()
  RETURNS "pg_catalog"."uuid" AS '$libdir/uuid-ossp', 'uuid_ns_oid'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;

-- ----------------------------
-- Function structure for uuid_ns_url
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."uuid_ns_url"();
CREATE FUNCTION "public"."uuid_ns_url"()
  RETURNS "pg_catalog"."uuid" AS '$libdir/uuid-ossp', 'uuid_ns_url'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;

-- ----------------------------
-- Function structure for uuid_ns_x500
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."uuid_ns_x500"();
CREATE FUNCTION "public"."uuid_ns_x500"()
  RETURNS "pg_catalog"."uuid" AS '$libdir/uuid-ossp', 'uuid_ns_x500'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;

-- ----------------------------
-- Checks structure for table asistencias
-- ----------------------------
ALTER TABLE "public"."asistencias" ADD CONSTRAINT "asistencias_estado_check" CHECK (estado::text = ANY (ARRAY['PRESENTE'::character varying::text, 'AUSENTE'::character varying::text, 'JUSTIFICADO'::character varying::text]));

-- ----------------------------
-- Checks structure for table cursos
-- ----------------------------
ALTER TABLE "public"."cursos" ADD CONSTRAINT "cursos_estado_check" CHECK (estado::text = ANY (ARRAY['ACTIVO'::character varying::text, 'FINALIZADO'::character varying::text]));
