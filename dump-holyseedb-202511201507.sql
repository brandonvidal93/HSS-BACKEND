--
-- PostgreSQL database dump
--

\restrict y9v3DNe7VqBeWHLT5qwl9NhNrbfKf8r3oShLw3ghm4SovTehIcF8Icd4c80gsMP

-- Dumped from database version 18.0
-- Dumped by pg_dump version 18.0

-- Started on 2025-11-20 15:07:26

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 2 (class 3079 OID 91183)
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- TOC entry 5082 (class 0 OID 0)
-- Dependencies: 2
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 223 (class 1259 OID 91259)
-- Name: comites; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.comites (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    nombre character varying(100) NOT NULL,
    descripcion text,
    fecha_creacion timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    lider_id uuid NOT NULL,
    templo_id uuid NOT NULL
);


ALTER TABLE public.comites OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 91236)
-- Name: miembros; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.miembros (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    nombres character varying(100) NOT NULL,
    apellidos character varying(100) NOT NULL,
    fecha_nacimiento date NOT NULL,
    telefono character varying(20),
    email character varying(150) NOT NULL,
    estado character varying(20) DEFAULT 'SIMPATIZANTE'::character varying NOT NULL,
    fecha_registro timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    fecha_bautismo date,
    activo boolean DEFAULT true,
    templo_id uuid NOT NULL
);


ALTER TABLE public.miembros OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 91194)
-- Name: pastores; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pastores (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    nombre character varying(100) NOT NULL,
    apellido character varying(100) NOT NULL,
    telefono character varying(20),
    correo character varying(150) NOT NULL,
    fecha_nacimiento date NOT NULL,
    fecha_ordenacion date NOT NULL,
    licencia_ministerial character varying(50) NOT NULL,
    estado character varying(20) DEFAULT 'EN_PROCESO'::character varying NOT NULL,
    templo_id uuid,
    fecha_creacion timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.pastores OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 91214)
-- Name: templos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.templos (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    nombre character varying(100) NOT NULL,
    direccion character varying(255),
    ciudad character varying(100),
    departamento character varying(100),
    pais character varying(100) NOT NULL,
    pastor_principal_id uuid,
    fecha_fundacion date NOT NULL,
    fecha_creacion timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.templos OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 91316)
-- Name: usuarios; Type: TABLE; Schema: public; Owner: holy_user
--

CREATE TABLE public.usuarios (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    nombre_usuario character varying(50) NOT NULL,
    contrasena_hash character varying(255) NOT NULL,
    rol character varying(20) NOT NULL,
    miembro_id uuid,
    pastor_id uuid,
    templo_id uuid NOT NULL,
    CONSTRAINT chk_one_entity_id CHECK ((((miembro_id IS NOT NULL) AND (pastor_id IS NULL)) OR ((miembro_id IS NULL) AND (pastor_id IS NOT NULL))))
);


ALTER TABLE public.usuarios OWNER TO holy_user;

--
-- TOC entry 5075 (class 0 OID 91259)
-- Dependencies: 223
-- Data for Name: comites; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.comites (id, nombre, descripcion, fecha_creacion, lider_id, templo_id) FROM stdin;
a8543311-35e7-4040-a6a8-0ac25668bf1c	Damas Dorcas	Población femenina de la Iglesia	2025-11-20 01:41:57.485-05	33e01db6-a09f-44ae-abb7-875a72587438	42e56263-72bd-470c-bd22-e57f078c02af
d9b26aef-1ab0-49ca-80ba-9decb2c5c222	DECOM	Departemento de Comunicaciones	2025-11-20 01:33:45.589-05	b6697871-3456-4880-bd8f-4896d3eab78c	42e56263-72bd-470c-bd22-e57f078c02af
4290694c-123b-47bb-b3ed-4ecdb149f0c4	Comité de Alabanza	Incluye planeación de cultos y ministerio de alabanza.	2020-06-05 19:00:00-05	caae149b-11f1-4b32-bba3-47fe7aa72c5c	42e56263-72bd-470c-bd22-e57f078c02af
\.


--
-- TOC entry 5074 (class 0 OID 91236)
-- Dependencies: 222
-- Data for Name: miembros; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.miembros (id, nombres, apellidos, fecha_nacimiento, telefono, email, estado, fecha_registro, fecha_bautismo, activo, templo_id) FROM stdin;
f5b52cd4-77bb-47b6-9603-841da9b137d4	Ana María	Restrepo	1998-04-11	3011112233	ana.restrepo@miembro.com	SERVIDOR	2025-11-19 10:13:43.619-05	2022-11-20	t	42e56263-72bd-470c-bd22-e57f078c02af
b6697871-3456-4880-bd8f-4896d3eab78c	Vanesa	Restrepo	2005-03-04	3116228428	vanesa.rpo@gmail.com	SERVIDOR	2025-11-20 01:09:04.358-05	2023-02-23	t	a12b4b27-2228-4e2e-98f0-9e9c5a68bb40
fce4fb2d-4f25-4894-84b6-1a7784d254aa	Samuel	Vidal	2004-05-28	3002561465	samu.vidal@gmail.com	BAUTIZADO	2025-11-20 01:11:31.947-05	2024-12-04	t	42e56263-72bd-470c-bd22-e57f078c02af
a859cec1-6a1f-4c5a-a052-e4b703453a63	Carlos	Perez	2025-11-19		carlos.p@gmail.com	SIMPATIZANTE	2025-11-20 01:12:34.662-05	\N	t	42e56263-72bd-470c-bd22-e57f078c02af
ca5b6605-cb68-46f9-bef2-3787e8ab43e0	Laura	Vélez	2025-10-07		laura.velez@gmail.com	SIMPATIZANTE	2025-11-20 01:15:35.187-05	\N	t	15ec4684-6c6c-48c3-89f1-8af73dbb91f6
caae149b-11f1-4b32-bba3-47fe7aa72c5c	Byron	Vidal	2014-02-19		byron.vidal@gmail.com	SERVIDOR	2025-11-20 01:16:55.333-05	\N	t	10be6013-4061-4a42-b0a3-d5abf2668e8b
33e01db6-a09f-44ae-abb7-875a72587438	Luz Elena	Jaramillo	1971-02-23		luz.jara@gmail.com	SERVIDOR	2025-11-20 01:18:59.151-05	\N	t	42e56263-72bd-470c-bd22-e57f078c02af
\.


--
-- TOC entry 5072 (class 0 OID 91194)
-- Dependencies: 220
-- Data for Name: pastores; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pastores (id, nombre, apellido, telefono, correo, fecha_nacimiento, fecha_ordenacion, licencia_ministerial, estado, templo_id, fecha_creacion) FROM stdin;
a16e0db7-f04e-4f64-a33e-6efea4170741	Dimas	Vallecilla	3001234567	dimas.v@holysee.com	1975-01-24	2005-08-09	LIC-PR-00125	ACTIVO	15ec4684-6c6c-48c3-89f1-8af73dbb91f6	2025-11-19 23:27:08.415898-05
7d66f480-6843-4ca6-8c87-59af7fd1d98c	Juan Carlos	Gonzalez	3015558877	carlos.gomez@holysee.com	1975-01-23	2005-08-08	LIC-PR-00123-RENOVADO	ACTIVO	42e56263-72bd-470c-bd22-e57f078c02af	2025-11-19 10:11:34.342117-05
8edc4c67-fda5-45fa-9ee8-2d19ac795f80	Isaí	García	3209871465	isai.g@hss.com	1993-02-14	2015-11-19	LIC-PR-00121	ACTIVO	a12b4b27-2228-4e2e-98f0-9e9c5a68bb40	2025-11-20 00:10:45.138438-05
49c9abb3-7f8b-45d6-b609-17c39e594a7c	Jaime	Araque	3128521436	jaime.a@hss.com	1990-11-19	2005-11-19	LIC-PR-00118	ACTIVO	5de01a46-271f-4a34-8686-148e26f9cef1	2025-11-20 00:25:28.141661-05
6a7138a1-2036-464e-a4bd-599b67b95bb7	Wilner	Montoya	3025894796	wilner.m@hss.com	2025-11-19	2025-11-19	LIC-PR-00100	ACTIVO	10be6013-4061-4a42-b0a3-d5abf2668e8b	2025-11-20 00:34:57.894942-05
3f9e3444-3d05-4d6c-980f-6c5f8f86c61a	Anderson	Muñoz	3216547896	anderson.m@hss.com	2025-11-15	2025-11-15	LIC-PR-00120	ACTIVO	5057ec1a-8a85-4cb7-8e12-7e633eb64d37	2025-11-19 23:58:19.279165-05
c41a9a96-f931-4ea2-b5e7-f4d7c83d52dd	Jader	Moreno	3132566947	jader.m@hss.com	1971-11-19	2025-11-19	LIC-PR-00110	ACTIVO	9bbbf6aa-a2db-4f33-801e-c56e69666731	2025-11-20 00:34:20.821703-05
93a1df90-a74b-4f4c-90aa-695de567daab	Brandon	Vidal	3218701465	brandonvidal93@gmail.com	1993-10-07	2024-11-19	LIC-PR-00119	ACTIVO	6c831e4c-c8c0-4244-b697-880f630d8ff8	2025-11-20 00:16:03.236143-05
29f3af23-1656-41b4-9a30-4cd9f78b9ecf	Santiago	Díaz	3156320012	santi.d@hss.com	1995-11-19	2025-11-19	LIC-PR-00115	ACTIVO	\N	2025-11-20 00:32:54.661594-05
a07b5243-86cd-4eaa-a7c4-ff1064fdbbce	Juan Carlos	Arroyave	3001234567	carlos@holysee.com	1975-01-23	2005-08-08	LIC-PR-00123	ACTIVO	1d681dc6-46d8-4300-a88c-ecf1c8d76cce	2025-11-19 18:47:32.957856-05
\.


--
-- TOC entry 5073 (class 0 OID 91214)
-- Dependencies: 221
-- Data for Name: templos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.templos (id, nombre, direccion, ciudad, departamento, pais, pastor_principal_id, fecha_fundacion, fecha_creacion) FROM stdin;
42e56263-72bd-470c-bd22-e57f078c02af	Palermo	Cra. 54 #91-65	Medellín	Antioquia	Colombia	7d66f480-6843-4ca6-8c87-59af7fd1d98c	1995-10-15	2025-11-19 10:07:59.6517-05
15ec4684-6c6c-48c3-89f1-8af73dbb91f6	Moravia	Carrera 49 A # 56-58	Medellín	Antioquia	Colombia	a16e0db7-f04e-4f64-a33e-6efea4170741	1998-06-06	2025-11-19 22:34:49.687831-05
5057ec1a-8a85-4cb7-8e12-7e633eb64d37	El Pato	Vereda El Pato	Zaragoza	Antioquia	Colombia	3f9e3444-3d05-4d6c-980f-6c5f8f86c61a	2000-06-07	2025-11-19 23:59:41.893571-05
a12b4b27-2228-4e2e-98f0-9e9c5a68bb40	Los Andes - 4ta	Barrio Los Andes	La Dorada	Caldas	Colombia	8edc4c67-fda5-45fa-9ee8-2d19ac795f80	2003-11-14	2025-11-20 00:11:29.777393-05
5de01a46-271f-4a34-8686-148e26f9cef1	Santa Cruz	Carrera 48 #56-56	Medellín	Antioquia	Colombia	49c9abb3-7f8b-45d6-b609-17c39e594a7c	1990-11-18	2025-11-20 00:24:45.388914-05
10be6013-4061-4a42-b0a3-d5abf2668e8b	Campo Valdéz	Carrera 45 #106 45	Medellín	Antioquia	Colombia	6a7138a1-2036-464e-a4bd-599b67b95bb7	1995-11-17	2025-11-20 00:30:57.829795-05
9bbbf6aa-a2db-4f33-801e-c56e69666731	San Isidro	Carrera 51B # 96-102	Medellín	Antioquia	Colombia	c41a9a96-f931-4ea2-b5e7-f4d7c83d52dd	2024-11-05	2025-11-20 00:17:40.963679-05
6c831e4c-c8c0-4244-b697-880f630d8ff8	Aranjuez	Carrera 51B	Medellín	Antioquia	Colombia	93a1df90-a74b-4f4c-90aa-695de567daab	1995-12-29	2025-11-19 23:04:03.938455-05
1d681dc6-46d8-4300-a88c-ecf1c8d76cce	Bello Central	Carrera 67 # 90-100	Bello	Antioquia	Colombia	a07b5243-86cd-4eaa-a7c4-ff1064fdbbce	1890-11-17	2025-11-20 00:32:03.182338-05
\.


--
-- TOC entry 5076 (class 0 OID 91316)
-- Dependencies: 224
-- Data for Name: usuarios; Type: TABLE DATA; Schema: public; Owner: holy_user
--

COPY public.usuarios (id, nombre_usuario, contrasena_hash, rol, miembro_id, pastor_id, templo_id) FROM stdin;
447b9431-3577-4562-83b2-c3bdd3846313	admin	$2b$10$rYc9dxktczjFUw/wd5SWj.ooyy3TKygEh9fKQ9Xy4mxaCuF4zfzQS	ADMIN	\N	7d66f480-6843-4ca6-8c87-59af7fd1d98c	42e56263-72bd-470c-bd22-e57f078c02af
\.


--
-- TOC entry 4912 (class 2606 OID 91271)
-- Name: comites comites_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comites
    ADD CONSTRAINT comites_pkey PRIMARY KEY (id);


--
-- TOC entry 4908 (class 2606 OID 91253)
-- Name: miembros miembros_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.miembros
    ADD CONSTRAINT miembros_email_key UNIQUE (email);


--
-- TOC entry 4910 (class 2606 OID 91251)
-- Name: miembros miembros_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.miembros
    ADD CONSTRAINT miembros_pkey PRIMARY KEY (id);


--
-- TOC entry 4896 (class 2606 OID 91211)
-- Name: pastores pastores_correo_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pastores
    ADD CONSTRAINT pastores_correo_key UNIQUE (correo);


--
-- TOC entry 4898 (class 2606 OID 91213)
-- Name: pastores pastores_licencia_ministerial_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pastores
    ADD CONSTRAINT pastores_licencia_ministerial_key UNIQUE (licencia_ministerial);


--
-- TOC entry 4900 (class 2606 OID 91209)
-- Name: pastores pastores_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pastores
    ADD CONSTRAINT pastores_pkey PRIMARY KEY (id);


--
-- TOC entry 4902 (class 2606 OID 91228)
-- Name: templos templos_nombre_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.templos
    ADD CONSTRAINT templos_nombre_key UNIQUE (nombre);


--
-- TOC entry 4904 (class 2606 OID 91230)
-- Name: templos templos_pastor_principal_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.templos
    ADD CONSTRAINT templos_pastor_principal_id_key UNIQUE (pastor_principal_id);


--
-- TOC entry 4906 (class 2606 OID 91226)
-- Name: templos templos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.templos
    ADD CONSTRAINT templos_pkey PRIMARY KEY (id);


--
-- TOC entry 4914 (class 2606 OID 91329)
-- Name: usuarios usuarios_nombre_usuario_key; Type: CONSTRAINT; Schema: public; Owner: holy_user
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_nombre_usuario_key UNIQUE (nombre_usuario);


--
-- TOC entry 4916 (class 2606 OID 91327)
-- Name: usuarios usuarios_pkey; Type: CONSTRAINT; Schema: public; Owner: holy_user
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_pkey PRIMARY KEY (id);


--
-- TOC entry 4920 (class 2606 OID 91272)
-- Name: comites fk_comites_lider; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comites
    ADD CONSTRAINT fk_comites_lider FOREIGN KEY (lider_id) REFERENCES public.miembros(id) ON DELETE RESTRICT;


--
-- TOC entry 4921 (class 2606 OID 91277)
-- Name: comites fk_comites_templo; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comites
    ADD CONSTRAINT fk_comites_templo FOREIGN KEY (templo_id) REFERENCES public.templos(id) ON DELETE CASCADE;


--
-- TOC entry 4919 (class 2606 OID 91254)
-- Name: miembros fk_miembros_templo; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.miembros
    ADD CONSTRAINT fk_miembros_templo FOREIGN KEY (templo_id) REFERENCES public.templos(id) ON DELETE RESTRICT;


--
-- TOC entry 4918 (class 2606 OID 91231)
-- Name: templos fk_pastor_principal; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.templos
    ADD CONSTRAINT fk_pastor_principal FOREIGN KEY (pastor_principal_id) REFERENCES public.pastores(id) ON DELETE SET NULL;


--
-- TOC entry 4917 (class 2606 OID 91282)
-- Name: pastores fk_pastores_templo; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pastores
    ADD CONSTRAINT fk_pastores_templo FOREIGN KEY (templo_id) REFERENCES public.templos(id) ON DELETE SET NULL;


--
-- TOC entry 4922 (class 2606 OID 91330)
-- Name: usuarios fk_usuarios_miembros; Type: FK CONSTRAINT; Schema: public; Owner: holy_user
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT fk_usuarios_miembros FOREIGN KEY (miembro_id) REFERENCES public.miembros(id) ON DELETE RESTRICT;


--
-- TOC entry 4923 (class 2606 OID 91335)
-- Name: usuarios fk_usuarios_pastores; Type: FK CONSTRAINT; Schema: public; Owner: holy_user
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT fk_usuarios_pastores FOREIGN KEY (pastor_id) REFERENCES public.pastores(id) ON DELETE RESTRICT;


--
-- TOC entry 4924 (class 2606 OID 91340)
-- Name: usuarios fk_usuarios_templo; Type: FK CONSTRAINT; Schema: public; Owner: holy_user
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT fk_usuarios_templo FOREIGN KEY (templo_id) REFERENCES public.templos(id) ON DELETE RESTRICT;


-- Completed on 2025-11-20 15:07:27

--
-- PostgreSQL database dump complete
--

\unrestrict y9v3DNe7VqBeWHLT5qwl9NhNrbfKf8r3oShLw3ghm4SovTehIcF8Icd4c80gsMP

