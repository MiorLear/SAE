--
-- PostgreSQL database dump
--

-- Dumped from database version 15.6 (Debian 15.6-0+deb12u1)
-- Dumped by pg_dump version 15.6 (Debian 15.6-0+deb12u1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'SQL_ASCII';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: cards; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cards (
    id integer NOT NULL,
    student_id integer NOT NULL,
    code character varying(20) NOT NULL,
    status character varying[] DEFAULT ARRAY['Pendiente de Pago'::text, 'Sin Canjear'::text, 'Pendiente de Entregar'::text, 'Habilitada'::text] NOT NULL,
    complement_id smallint[],
    date timestamp with time zone[] DEFAULT ARRAY[NULL::timestamp with time zone, NULL::timestamp with time zone, now()] NOT NULL,
    event_id smallint NOT NULL,
    type character varying DEFAULT 'Adicional'::character varying NOT NULL,
    CONSTRAINT cards_type CHECK (((type)::text = ANY (ARRAY[('Preasignada'::character varying)::text, ('Adicional'::character varying)::text, (NULL::character varying)::text])))
);


ALTER TABLE public.cards OWNER TO postgres;

--
-- Name: cards_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.cards_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.cards_id_seq OWNER TO postgres;

--
-- Name: cards_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.cards_id_seq OWNED BY public.cards.id;


--
-- Name: control_log_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.control_log_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.control_log_id_seq OWNER TO postgres;

--
-- Name: control_log; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.control_log (
    id integer DEFAULT nextval('public.control_log_id_seq'::regclass) NOT NULL,
    content jsonb NOT NULL,
    seen integer[]
);


ALTER TABLE public.control_log OWNER TO postgres;

--
-- Name: events_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.events_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.events_id_seq OWNER TO postgres;

--
-- Name: events; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.events (
    id integer DEFAULT nextval('public.events_id_seq'::regclass) NOT NULL,
    name character varying(50) NOT NULL,
    year smallint DEFAULT EXTRACT(year FROM now()) NOT NULL,
    status character varying(20) DEFAULT 'Pendiente de Iniciar'::character varying NOT NULL,
    settings jsonb NOT NULL,
    data jsonb,
    CONSTRAINT status_check CHECK (((status)::text = ANY (ARRAY[('Pendiente de Iniciar'::character varying)::text, ('Inicializado'::character varying)::text, ('Deshabilitado'::character varying)::text, (NULL::character varying)::text])))
);


ALTER TABLE public.events OWNER TO postgres;

--
-- Name: grades; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.grades (
    id integer NOT NULL,
    name character varying(60) NOT NULL,
    status character varying(20) DEFAULT 'Habilitado'::character varying NOT NULL,
    students_quantity smallint NOT NULL,
    CONSTRAINT status_check CHECK (((status)::text = ANY (ARRAY[('Habilitado'::character varying)::text, ('Deshabilitado'::character varying)::text, (NULL::character varying)::text])))
);


ALTER TABLE public.grades OWNER TO postgres;

--
-- Name: grades_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.grades_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.grades_id_seq OWNER TO postgres;

--
-- Name: grades_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.grades_id_seq OWNED BY public.grades.id;


--
-- Name: levels_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.levels_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.levels_id_seq OWNER TO postgres;

--
-- Name: levels; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.levels (
    id integer DEFAULT nextval('public.levels_id_seq'::regclass) NOT NULL,
    name character varying(50),
    grades integer[],
    status character varying(20) DEFAULT 'Habilitado'::character varying NOT NULL,
    CONSTRAINT status_check CHECK (((status)::text = ANY (ARRAY[('Habilitado'::character varying)::text, ('Deshabilitado'::character varying)::text, (NULL::character varying)::text])))
);


ALTER TABLE public.levels OWNER TO postgres;

--
-- Name: parentage_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.parentage_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.parentage_id_seq OWNER TO postgres;

--
-- Name: parentage; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.parentage (
    id integer DEFAULT nextval('public.parentage_id_seq'::regclass) NOT NULL,
    affiliates smallint[] NOT NULL
);


ALTER TABLE public.parentage OWNER TO postgres;

--
-- Name: permisions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.permisions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.permisions_id_seq OWNER TO postgres;

--
-- Name: permissions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.permissions (
    id integer DEFAULT nextval('public.permisions_id_seq'::regclass) NOT NULL,
    name character varying(50) NOT NULL,
    event_id smallint
);


ALTER TABLE public.permissions OWNER TO postgres;

--
-- Name: roles_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.roles_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.roles_id_seq OWNER TO postgres;

--
-- Name: roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.roles (
    id integer DEFAULT nextval('public.roles_id_seq'::regclass) NOT NULL,
    name character varying(50) NOT NULL,
    permissions_id integer[] NOT NULL,
    status character varying(20) DEFAULT 'Habilitado'::character varying NOT NULL,
    CONSTRAINT status_check CHECK (((status)::text = ANY (ARRAY[('Habilitado'::character varying)::text, ('Deshabilitado'::character varying)::text, (NULL::character varying)::text])))
);


ALTER TABLE public.roles OWNER TO postgres;

--
-- Name: sections; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sections (
    id integer NOT NULL,
    name character varying(1)
);


ALTER TABLE public.sections OWNER TO postgres;

--
-- Name: sections_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.sections_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.sections_id_seq OWNER TO postgres;

--
-- Name: sections_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.sections_id_seq OWNED BY public.sections.id;


--
-- Name: students; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.students (
    id integer NOT NULL,
    name character varying[] NOT NULL,
    carnet bigint NOT NULL,
    grades integer[],
    status character varying(20) DEFAULT 'Habilitado'::character varying NOT NULL,
    CONSTRAINT statu_check CHECK (((status)::text = ANY (ARRAY[('Habilitado'::character varying)::text, ('Deshabilitado'::character varying)::text, (NULL::character varying)::text])))
);


ALTER TABLE public.students OWNER TO postgres;

--
-- Name: students_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.students_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.students_id_seq OWNER TO postgres;

--
-- Name: students_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.students_id_seq OWNED BY public.students.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    name character varying[] NOT NULL,
    pass character varying(100) NOT NULL,
    mail character varying(100) NOT NULL,
    rol_id integer NOT NULL,
    picture character varying(50) DEFAULT 'not_image_selected.png'::character varying NOT NULL,
    status character varying(20) DEFAULT 'Habilitado'::character varying NOT NULL,
    CONSTRAINT status_check CHECK (((status)::text = ANY (ARRAY[('Habilitado'::character varying)::text, ('Deshabilitado'::character varying)::text, (NULL::character varying)::text])))
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: cards id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cards ALTER COLUMN id SET DEFAULT nextval('public.cards_id_seq'::regclass);


--
-- Name: grades id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.grades ALTER COLUMN id SET DEFAULT nextval('public.grades_id_seq'::regclass);


--
-- Name: sections id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sections ALTER COLUMN id SET DEFAULT nextval('public.sections_id_seq'::regclass);


--
-- Name: students id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.students ALTER COLUMN id SET DEFAULT nextval('public.students_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: cards; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cards (id, student_id, code, status, complement_id, date, event_id, type) FROM stdin;
\.


--
-- Data for Name: control_log; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.control_log (id, content, seen) FROM stdin;
\.


--
-- Data for Name: events; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.events (id, name, year, status, settings, data) FROM stdin;
195	Semana de Juventud	2024	Pendiente de Iniciar	{"date": {"date": ["2024-08-12", "2024-08-28"], "type": "Rango de días"}, "elementary": {"type": "Externo", "price": "15.00", "levels": ["5", "4", "3", "2", "1"], "isPayed": true, "hasComplements": true, "targetAudience": "Publico General", "assistanceMethod": "Tarjetas"}, "complements": [{"Nombre": "Papas Fritas", "Precio": "$2.00"}, {"Nombre": "Soda", "Precio": "$0.75"}, {"Nombre": "Crepas", "Precio": "$3.00"}]}	\N
196	Festival de la canción	2024	Deshabilitado	{"date": {"date": ["2024-08-27", "2024-08-27"], "type": "Rango de días"}, "elementary": {"type": "Externo", "price": "20.00", "levels": ["5", "4", "3", "2", "1"], "isPayed": true, "hasComplements": true, "targetAudience": "Publico General", "assistanceMethod": "Tarjetas"}, "complements": [{"name": "Soda", "price": "0.75"}]}	\N
194	Cena de la Familia Chaleca	2024	Deshabilitado	{"date": {"date": ["08/06/2024", "08/07/2024"], "type": "Rango de días"}, "elementary": {"type": "Externo", "price": 4.99, "levels": [1, 2, 3, 4, 5], "isPayed": true, "hasComplements": true, "targetAudience": "Publico General", "assistanceMethod": "Tarjetas"}, "complements": [{"name": "Cena", "price": 3.99}, {"name": "Refresco", "price": 1.99}]}	\N
\.


--
-- Data for Name: grades; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.grades (id, name, status, students_quantity) FROM stdin;
1	Kinder 4	Habilitado	30
2	Kinder 5	Habilitado	30
3	Preparatoria	Habilitado	30
4	Primer Grado	Habilitado	30
5	Segundo Grado	Habilitado	30
6	Tercer Grado	Habilitado	30
7	Cuarto Grado	Habilitado	30
8	Quinto Grado	Habilitado	30
9	Sexto Grado	Habilitado	30
10	Séptimo Grado	Habilitado	30
11	Octavo Grado	Habilitado	30
12	Noveno Grado	Habilitado	30
13	Primer Año	Habilitado	30
14	Segundo Año	Habilitado	30
15	Tercer Año	Habilitado	30
\.


--
-- Data for Name: levels; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.levels (id, name, grades, status) FROM stdin;
1	Parvularia	{13,14,15}	Habilitado
2	Primer Ciclo	{6,5,4}	Habilitado
3	Segundo Ciclo	{9,8,7}	Habilitado
4	Tercer Ciclo	{12,11,10}	Habilitado
5	Bachillerato	{10,11,12}	Habilitado
\.


--
-- Data for Name: parentage; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.parentage (id, affiliates) FROM stdin;
\.


--
-- Data for Name: permissions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.permissions (id, name, event_id) FROM stdin;
2	Gestion y Analisis	\N
27	Listar Estudiantes	\N
28	Administrar Estudiantes	\N
29	Listar Roles	\N
30	Administrar Roles	\N
31	Listar Niveles	\N
32	Administrar Niveles	\N
33	Listar Eventos	\N
34	Administrar Eventos	\N
35	Listar Usuarios	\N
36	Administrar Usuarios	\N
1	Administrar Plataforma	\N
\.


--
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.roles (id, name, permissions_id, status) FROM stdin;
47	Super Administrador	{1}	Habilitado
74	Finanzas	{31,2}	Habilitado
\.


--
-- Data for Name: sections; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sections (id, name) FROM stdin;
1	A
2	B
3	C
\.


--
-- Data for Name: students; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.students (id, name, carnet, grades, status) FROM stdin;
14	{"Gabriel Alejandro","Pérez Martínez"}	20130025	{8,1}	Habilitado
2	{"Juan Carlos","Gómez Fernández"}	20210065	{7,3}	Habilitado
3	{"Fernando Alberto","Paredes Salgado"}	20200098	{1,1}	Habilitado
17	{"Cesar Adrián","Figueroa Ramos"}	101433	{12,2}	Habilitado
4	{"Luis Miguel","Pérez Martínez"}	20170015	{10,1}	Habilitado
16	{"Miguel Orlando","Ledezma\tArévalo"}	20110015	{12,2}	Habilitado
6	{"Ana Laura","Ruiz López"}	20230014	{3,2}	Habilitado
10	{"Luis Eduardo","Pérez López"}	20140042	{9,1}	Habilitado
7	{"Carlos José","Jiménez García"}	20170075	{5,3}	Habilitado
5	{"María Elena","Rodríguez Sánchez"}	20220048	{2,3}	Habilitado
8	{"Juan Manuel","Gómez Rodríguez"}	20190015	{6,1}	Habilitado
1	{"Carlos José","Pérez Salazar"}	20210024	{4,2}	Habilitado
9	{"Alejandro José","Sánchez Martínez"}	20200090	{8,1}	Habilitado
18	{"Gustavo Manuel","Castillo Campos"}	20210120	{11,1}	Habilitado
11	{"Carlos Alberto","Fernández Ruiz"}	20170023	{11,2}	Habilitado
12	{"Martín Antonio","Jiménez García"}	20150052	{12,2}	Habilitado
21	{"Luis Miguel","Hernández Artega"}	20154684	{8,NULL}	Habilitado
23	{"José José","Boris Arévalo"}	20204536	{9,3}	Deshabilitado
13	{"Andrés Felipe","Hernández Sánchez"}	20140051	{9,2}	Habilitado
15	{"Nicolás Iván","Ruiz López"}	20160032	{10,2}	Habilitado
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, name, pass, mail, rol_id, picture, status) FROM stdin;
4	{Administrador,CSSC}	$2y$10$wiGB9j7vWDk/kE/YJVK2q.qw6ZgJIkwt/gz7N.9If6Uv3.OZnjYDy	Administrador@santacecilia.edu.sv	47	temp_img.png	Habilitado
26	{Miguel,Ledezma}	$2y$10$wiGB9j7vWDk/kE/YJVK2q.qw6ZgJIkwt/gz7N.9If6Uv3.OZnjYDy	miguelledezma005@gmail.com	47	Miguel_Ledezma_8408.png	Habilitado
\.


--
-- Name: cards_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.cards_id_seq', 1, false);


--
-- Name: control_log_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.control_log_id_seq', 467, true);


--
-- Name: events_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.events_id_seq', 196, true);


--
-- Name: grades_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.grades_id_seq', 17, true);


--
-- Name: levels_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.levels_id_seq', 20, true);


--
-- Name: parentage_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.parentage_id_seq', 1, false);


--
-- Name: permisions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.permisions_id_seq', 36, true);


--
-- Name: roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.roles_id_seq', 74, true);


--
-- Name: sections_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sections_id_seq', 3, true);


--
-- Name: students_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.students_id_seq', 24, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 26, true);


--
-- Name: cards cards_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cards
    ADD CONSTRAINT cards_pkey PRIMARY KEY (id);


--
-- Name: control_log control_log_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.control_log
    ADD CONSTRAINT control_log_pkey PRIMARY KEY (id);


--
-- Name: events events_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_pkey PRIMARY KEY (id);


--
-- Name: grades grades_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.grades
    ADD CONSTRAINT grades_pkey PRIMARY KEY (id);


--
-- Name: levels levels_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.levels
    ADD CONSTRAINT levels_pkey PRIMARY KEY (id);


--
-- Name: parentage parentage_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.parentage
    ADD CONSTRAINT parentage_pkey PRIMARY KEY (id);


--
-- Name: permissions permisions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permisions_pkey PRIMARY KEY (id);


--
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- Name: sections sections_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sections
    ADD CONSTRAINT sections_pkey PRIMARY KEY (id);


--
-- Name: students students_carnet_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.students
    ADD CONSTRAINT students_carnet_key UNIQUE (carnet);


--
-- Name: students students_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.students
    ADD CONSTRAINT students_pkey PRIMARY KEY (id);


--
-- Name: cards unique_card; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cards
    ADD CONSTRAINT unique_card UNIQUE (code, event_id);


--
-- Name: events unique_event; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT unique_event UNIQUE (name, year);


--
-- Name: users users_mail_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_mail_pkey UNIQUE (mail);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users fk_id_rol; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT fk_id_rol FOREIGN KEY (rol_id) REFERENCES public.roles(id);


--
-- Name: cards fk_id_student; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cards
    ADD CONSTRAINT fk_id_student FOREIGN KEY (student_id) REFERENCES public.students(id);


--
-- PostgreSQL database dump complete
--

