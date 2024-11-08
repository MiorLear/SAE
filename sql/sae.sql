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
    status character varying(20) DEFAULT 'Pendiente de Iniciar'::character varying NOT NULL,
    settings jsonb NOT NULL,
    data jsonb DEFAULT '{}'::jsonb,
    CONSTRAINT status_check CHECK (((status)::text = ANY (ARRAY[('Pendiente de Iniciar'::character varying)::text, ('Inicializado'::character varying)::text, ('Listo'::character varying)::text, ('En curso'::character varying)::text, ('Finalizado'::character varying)::text, ('Deshabilitado'::character varying)::text, (NULL::character varying)::text])))
);


ALTER TABLE public.events OWNER TO postgres;

--
-- Name: grades; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.grades (
    id integer NOT NULL,
    name character varying(60) NOT NULL,
    status character varying(20) DEFAULT 'Habilitado'::character varying NOT NULL,
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
    name character varying(50) NOT NULL
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
    picture character varying(50) DEFAULT 'temp_img.png'::character varying NOT NULL,
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
689	{"ID": "218", "date": "17/10/2024", "table": "events", "title": {"table": "Evento ", "action": "Reconfigurado."}, "Nombre": "Cena de la Familia Chaleca", "Precio": "15.00", "action": "editSettings", "author": "Miguel Ledezma", "Niveles": "Bachillerato, Tercer Ciclo, Primer Ciclo, Kinder"}	\N
690	{"ID": "218", "date": "17/10/2024", "table": "events", "title": {"table": "Evento ", "action": "Reconfigurado."}, "Nombre": "Cena de la Familia Chaleca", "Precio": "15.00", "action": "editSettings", "author": "Miguel Ledezma", "Niveles": "Bachillerato, Tercer Ciclo, Primer Ciclo, Kinder"}	\N
691	{"ID": "218", "date": "17/10/2024", "table": "events", "title": {"table": "Evento ", "action": "Reconfigurado."}, "Nombre": "Cena de la Familia Chaleca", "Precio": "15.00", "action": "editSettings", "author": "Miguel Ledezma", "Niveles": "Bachillerato, Tercer Ciclo, Primer Ciclo, Kinder"}	\N
692	{"ID": "218", "date": "17/10/2024", "table": "events", "title": {"table": "Evento ", "action": "Reconfigurado."}, "Nombre": "Cena de la Familia Chaleca", "Precio": "15.00", "action": "editSettings", "author": "Miguel Ledezma", "Niveles": "Bachillerato, Tercer Ciclo, Primer Ciclo, Kinder"}	\N
693	{"ID": "218", "date": "19/10/2024", "table": "events", "title": {"table": "Evento ", "action": "Reconfigurado."}, "Nombre": "Cena de la Familia Chaleca", "Precio": "15.00", "action": "editSettings", "author": "Miguel Ledezma", "Niveles": "Bachillerato, Tercer Ciclo, Primer Ciclo, Kinder"}	\N
694	{"ID": "218", "date": "19/10/2024", "table": "events", "title": {"table": "Evento ", "action": "Reconfigurado."}, "Nombre": "Cena de la Familia Chaleca", "Precio": "15.00", "action": "editSettings", "author": "Miguel Ledezma", "Niveles": "Bachillerato, Tercer Ciclo, Primer Ciclo, Kinder"}	\N
695	{"ID": "218", "date": "19/10/2024", "table": "events", "title": {"table": "Evento ", "action": "Reconfigurado."}, "Nombre": "Cena de la Familia Chaleca", "Precio": "15.00", "action": "editSettings", "author": "Miguel Ledezma", "Niveles": "Bachillerato, Tercer Ciclo, Primer Ciclo, Kinder"}	\N
696	{"ID": "218", "date": "19/10/2024", "table": "events", "title": {"table": "Evento ", "action": "Reconfigurado."}, "Nombre": "Cena de la Familia Chaleca", "Precio": "15.00", "action": "editSettings", "author": "Miguel Ledezma", "Niveles": "Bachillerato, Tercer Ciclo, Primer Ciclo, Kinder"}	\N
697	{"ID": "218", "date": "19/10/2024", "table": "events", "title": {"table": "Evento ", "action": "Reconfigurado."}, "Nombre": "Cena de la Familia Chaleca", "Precio": "15.00", "action": "editSettings", "author": "Miguel Ledezma", "Niveles": "Bachillerato, Tercer Ciclo, Primer Ciclo, Kinder"}	\N
698	{"ID": "218", "date": "19/10/2024", "table": "events", "title": {"table": "Evento ", "action": "Reconfigurado."}, "Nombre": "Cena de la Familia Chaleca", "Precio": "15.00", "action": "editSettings", "author": "Miguel Ledezma", "Niveles": "Bachillerato, Tercer Ciclo, Primer Ciclo, Kinder"}	\N
699	{"ID": "218", "date": "19/10/2024", "table": "events", "title": {"table": "Evento ", "action": "Reconfigurado."}, "Nombre": "Cena de la Familia Chaleca", "Precio": "15.00", "action": "editSettings", "author": "Miguel Ledezma", "Niveles": "Bachillerato, Tercer Ciclo, Primer Ciclo, Kinder"}	\N
700	{"ID": "218", "date": "19/10/2024", "table": "events", "title": {"table": "Evento ", "action": "Reconfigurado."}, "Nombre": "Cena de la Familia Chaleca", "Precio": "15.00", "action": "editSettings", "author": "Miguel Ledezma", "Niveles": "Bachillerato, Tercer Ciclo, Primer Ciclo, Kinder", "Fecha del Evento": "Octubre 19, 2024"}	\N
701	{"ID": "219", "date": "19/10/2024", "table": "events", "title": {"table": "Evento ", "action": "Registrado."}, "Nombre": "Cena Cenistica", "Precio": "15.00", "action": "add", "author": "Miguel Ledezma", "Niveles": "Tercer Ciclo", "Complementos": "nombre: Soda, precio: 0.50 <br   >nombre: Papas, precio: 0.75 <br   >", "Fecha del Evento": "Octubre 25, 2024"}	\N
702	{"ID": "219", "date": "19/10/2024", "table": "events", "title": {"table": "Evento ", "action": "Reconfigurado."}, "Nombre": "Fiesta Semana de Juventud", "Precio": "15.00", "action": "editSettings", "author": "Miguel Ledezma", "Niveles": "Tercer Ciclo", "Fecha del Evento": "Octubre 25, 2024"}	\N
703	{"ID": "220", "date": "19/10/2024", "table": "events", "title": {"table": "Evento ", "action": "Registrado."}, "Nombre": "Fiesta Intramuros", "Precio": "15.00", "action": "add", "author": "Miguel Ledezma", "Niveles": "Bachillerato, Tercer Ciclo, Segundo Ciclo, Primer Ciclo, Kinder", "Complementos": "nombre: Cena, precio: 7.00 <br   >nombre: Tacos, precio: 8.00 <br   >nombre: Pupusas, precio: 0.75 <br   >", "Fecha del Evento": "Octubre 22, 2024"}	\N
704	{"ID": "223", "date": "19/10/2024", "table": "events", "title": {"table": "Evento ", "action": "Registrado."}, "Nombre": "Fiesta Intramuros", "Precio": "15.00", "action": "add", "author": "Miguel Ledezma", "Niveles": "Bachillerato", "Fecha del Evento": "Marzo 13, 2025"}	\N
705	{"ID": "224", "date": "20/10/2024", "table": "events", "title": {"table": "Evento ", "action": "Registrado."}, "Nombre": "Cena de la Familia Chaleca", "Precio": "8.00", "action": "add", "author": "Miguel Ledezma", "Niveles": "Bachillerato, Tercer Ciclo, Segundo Ciclo, Primer Ciclo, Kinder", "Fecha del Evento": "Octubre 22, 2024"}	\N
706	{"ID": "225", "date": "20/10/2024", "table": "events", "title": {"table": "Evento ", "action": "Registrado."}, "Nombre": "Cena de la Familia Chaleca", "Precio": "10.00", "action": "add", "author": "Miguel Ledezma", "Niveles": "Bachillerato, Tercer Ciclo, Segundo Ciclo, Primer Ciclo, Kinder", "Fecha del Evento": "Octubre 25, 2024"}	\N
707	{"ID": "226", "date": "20/10/2024", "table": "events", "title": {"table": "Evento ", "action": "Registrado."}, "Nombre": "Cena de la Familia Chaleca", "Precio": "15.00", "action": "add", "author": "Miguel Ledezma", "Niveles": "Bachillerato, Tercer Ciclo, Segundo Ciclo, Primer Ciclo, Kinder", "Fecha del Evento": "Octubre 23, 2024"}	\N
708	{"ID": "227", "date": "20/10/2024", "table": "events", "title": {"table": "Evento ", "action": "Registrado."}, "Nombre": "Cena de la Familia Chaleca", "Precio": "10.00", "action": "add", "author": "Miguel Ledezma", "Niveles": "Bachillerato, Tercer Ciclo, Segundo Ciclo, Primer Ciclo, Kinder", "Fecha del Evento": "Octubre 22, 2024"}	\N
709	{"ID": "228", "date": "20/10/2024", "table": "events", "title": {"table": "Evento ", "action": "Registrado."}, "Nombre": "Cena de la Familia Chaleca", "Precio": "10.00", "action": "add", "author": "Miguel Ledezma", "Niveles": "Bachillerato, Tercer Ciclo, Segundo Ciclo, Primer Ciclo, Kinder", "Complementos": "nombre: Cena, precio: 8.00 <br   >nombre: Soda, precio: 0.75 <br   >", "Fecha del Evento": "Octubre 23, 2024"}	\N
710	{"ID": "229", "date": "20/10/2024", "table": "events", "title": {"table": "Evento ", "action": "Registrado."}, "Nombre": "Cena de la Familia Chaleca", "Precio": "10.00", "action": "add", "author": "Miguel Ledezma", "Niveles": "Bachillerato, Tercer Ciclo, Segundo Ciclo, Primer Ciclo, Kinder", "Fecha del Evento": "Octubre 23, 2024"}	\N
711	{"ID": "229", "date": "20/10/2024", "table": "events", "title": {"table": "Evento ", "action": "Complementos Editados."}, "action": "editComplements", "author": "Miguel Ledezma", "Complementos": "nombre: Cena, precio: 8.00 <br   >nombre: Tacos, precio: 5.00 <br   >nombre: Soda, precio: 0.75 <br   >"}	\N
712	{"ID": "229", "date": "20/10/2024", "table": "events", "title": {"table": "Evento ", "action": "Complementos Editados."}, "action": "editComplements", "author": "Miguel Ledezma", "Complementos": "nombre: Cena, precio: 8.00 <br   >nombre: Tacos, precio: 5.00 <br   >nombre: Soda, precio: 0.75 <br   >"}	\N
713	{"ID": "229", "date": "20/10/2024", "table": "events", "title": {"table": "Evento ", "action": "Complementos Editados."}, "action": "editComplements", "author": "Miguel Ledezma", "Complementos": ""}	\N
714	{"ID": "229", "date": "20/10/2024", "table": "events", "title": {"table": "Evento ", "action": "Complementos Editados."}, "action": "editComplements", "author": "Miguel Ledezma", "Complementos": "nombre: Cena, precio: 8.00 <br   >"}	\N
715	{"ID": "229", "date": "20/10/2024", "table": "events", "title": {"table": "Evento ", "action": "Complementos Editados."}, "action": "editComplements", "author": "Miguel Ledezma", "Complementos": ""}	\N
716	{"ID": "229", "date": "20/10/2024", "table": "events", "title": {"table": "Evento ", "action": "Complementos Editados."}, "action": "editComplements", "author": "Miguel Ledezma", "Complementos": "nombre: Soda, precio: 0.75 <br   >"}	\N
717	{"ID": "229", "date": "20/10/2024", "table": "events", "title": {"table": "Evento ", "action": "Complementos Editados."}, "action": "editComplements", "author": "Miguel Ledezma", "Complementos": ""}	\N
718	{"ID": "229", "date": "20/10/2024", "table": "events", "title": {"table": "Evento ", "action": "Complementos Editados."}, "action": "editComplements", "author": "Miguel Ledezma", "Complementos": ""}	\N
719	{"ID": "229", "date": "20/10/2024", "table": "events", "title": {"table": "Evento ", "action": "Complementos Editados."}, "action": "editComplements", "author": "Miguel Ledezma", "Complementos": ""}	\N
720	{"ID": "229", "date": "20/10/2024", "table": "events", "title": {"table": "Evento ", "action": "Complementos Editados."}, "action": "editComplements", "author": "Miguel Ledezma", "Complementos": "nombre: Soda, precio: 0.75 <br   >"}	\N
721	{"ID": "229", "date": "20/10/2024", "table": "events", "title": {"table": "Evento ", "action": "Complementos Editados."}, "action": "editComplements", "author": "Miguel Ledezma", "Complementos": "nombre: Soda, precio: 0.75 <br   >"}	\N
722	{"ID": "229", "date": "20/10/2024", "table": "events", "title": {"table": "Evento ", "action": "Complementos Editados."}, "action": "editComplements", "author": "Miguel Ledezma", "Complementos": ""}	\N
723	{"ID": "229", "date": "20/10/2024", "table": "events", "title": {"table": "Evento ", "action": "Complementos Editados."}, "action": "editComplements", "author": "Miguel Ledezma", "Complementos": ""}	\N
724	{"ID": "230", "date": "20/10/2024", "table": "events", "title": {"table": "Evento ", "action": "Registrado."}, "Nombre": "Cena de la Familia Chaleca", "Precio": "15.00", "action": "add", "author": "Miguel Ledezma", "Niveles": "Bachillerato, Tercer Ciclo, Segundo Ciclo, Primer Ciclo, Kinder", "Fecha del Evento": "Octubre 26, 2024"}	\N
725	{"ID": "231", "date": "20/10/2024", "table": "events", "title": {"table": "Evento ", "action": "Registrado."}, "Nombre": "Cena de la Familia Chaleca", "Precio": "15.00", "action": "add", "author": "Miguel Ledezma", "Niveles": "Bachillerato, Tercer Ciclo, Segundo Ciclo, Primer Ciclo, Kinder", "Complementos": "nombre: Tacos, precio: 5 <br   >", "Fecha del Evento": "Octubre 24, 2024"}	\N
726	{"ID": "231", "date": "20/10/2024", "table": "events", "title": {"table": "Evento ", "action": "Complementos Editados."}, "action": "editComplements", "author": "Miguel Ledezma", "Complementos": "nombre: Tacos, precio: 5.00 <br   >nombre: Soda, precio: 0.75 <br   >"}	\N
727	{"ID": "231", "date": "20/10/2024", "table": "events", "title": {"table": "Evento ", "action": "Complementos Editados."}, "action": "editComplements", "author": "Miguel Ledezma", "Complementos": "nombre: Tacos, precio: 5.00 <br   >nombre: Soda, precio: 0.75 <br   >"}	\N
728	{"ID": "231", "date": "20/10/2024", "table": "events", "title": {"table": "Evento ", "action": "Complementos Editados."}, "action": "editComplements", "author": "Miguel Ledezma", "Complementos": "nombre: Tacos, precio: 5.00 <br   >nombre: Soda, precio: 0.75 <br   >nombre: Papas, precio: 3.00 <br   >"}	\N
729	{"ID": "231", "date": "20/10/2024", "table": "events", "title": {"table": "Evento ", "action": "Complementos Editados."}, "action": "editComplements", "author": "Miguel Ledezma", "Complementos": "nombre: Tacos, precio: 5.00 <br   >nombre: Soda, precio: 0.75 <br   >nombre: Papas, precio: 3.00 <br   >"}	\N
730	{"ID": "231", "date": "20/10/2024", "table": "events", "title": {"table": "Evento ", "action": "Complementos Editados."}, "action": "editComplements", "author": "Miguel Ledezma", "Complementos": "nombre: Tacos, precio: 5.00 <br   >nombre: Soda, precio: 0.75 <br   >nombre: Papas, precio: 3.00 <br   >"}	\N
731	{"ID": "232", "date": "20/10/2024", "table": "events", "title": {"table": "Evento ", "action": "Registrado."}, "Nombre": "Cena de la Familia Chaleca", "Precio": "15.00", "action": "add", "author": "Miguel Ledezma", "Niveles": "Tercer Ciclo", "Complementos": "nombre: soda, precio: 0.75 <br   >", "Fecha del Evento": "Octubre 25, 2024"}	\N
732	{"ID": "233", "date": "20/10/2024", "table": "events", "title": {"table": "Evento ", "action": "Registrado."}, "Nombre": "Cena de la Familia Chaleca", "Precio": "15.00", "action": "add", "author": "Miguel Ledezma", "Niveles": "Bachillerato, Tercer Ciclo, Segundo Ciclo, Primer Ciclo, Kinder", "Fecha del Evento": "Octubre 24, 2024"}	\N
733	{"ID": "234", "date": "20/10/2024", "table": "events", "title": {"table": "Evento ", "action": "Registrado."}, "Nombre": "Cena de la Familia Chaleca", "Precio": "15.00", "action": "add", "author": "Miguel Ledezma", "Niveles": "Bachillerato, Tercer Ciclo, Segundo Ciclo, Primer Ciclo, Kinder", "Fecha del Evento": "Octubre 30, 2024"}	\N
734	{"ID": "234", "date": "20/10/2024", "table": "events", "title": {"table": "Evento ", "action": "Complementos Editados."}, "action": "editComplements", "author": "Miguel Ledezma", "Complementos": "nombre: Soda, precio: 0.74 <br   >"}	\N
735	{"ID": "235", "date": "20/10/2024", "table": "events", "title": {"table": "Evento ", "action": "Registrado."}, "Nombre": "Cena de la Familia Chaleca", "Precio": "15.00", "action": "add", "author": "Miguel Ledezma", "Niveles": "Bachillerato, Tercer Ciclo, Segundo Ciclo, Primer Ciclo, Kinder", "Complementos": "nombre: Cena, precio: 8.00 <br   >", "Fecha del Evento": "Octubre 22, 2024"}	\N
736	{"ID": "236", "date": "20/10/2024", "table": "events", "title": {"table": "Evento ", "action": "Registrado."}, "Nombre": "Fiesta Intramuros", "Precio": "15.00", "action": "add", "author": "Miguel Ledezma", "Niveles": "Bachillerato, Tercer Ciclo, Segundo Ciclo, Primer Ciclo, Kinder", "Complementos": "nombre: Soda, precio: 0.75 <br   >", "Fecha del Evento": "Octubre 30, 2024"}	\N
737	{"ID": "237", "date": "20/10/2024", "table": "events", "title": {"table": "Evento ", "action": "Registrado."}, "Nombre": "Cena de la Familia Chaleca", "Precio": "15.00", "action": "add", "author": "Miguel Ledezma", "Niveles": "Bachillerato, Tercer Ciclo, Segundo Ciclo, Primer Ciclo, Kinder", "Complementos": "nombre: Soda, precio: 0.75 <br   >", "Fecha del Evento": "Octubre 29, 2024"}	\N
738	{"ID": "238", "date": "20/10/2024", "table": "events", "title": {"table": "Evento ", "action": "Registrado."}, "Nombre": "Cena de la Familia Chaleca", "Precio": "15.00", "action": "add", "author": "Miguel Ledezma", "Niveles": "Bachillerato, Tercer Ciclo, Segundo Ciclo, Primer Ciclo, Kinder", "Complementos": "nombre: Cena, precio: 8.00 <br   >nombre: Soda, precio: 0.75 <br   >", "Fecha del Evento": "Octubre 23, 2024"}	\N
739	{"ID": "239", "date": "20/10/2024", "table": "events", "title": {"table": "Evento ", "action": "Registrado."}, "Nombre": "Cena de la Familia Chaleca", "Precio": "15.00", "action": "add", "author": "Miguel Ledezma", "Niveles": "Bachillerato, Tercer Ciclo, Segundo Ciclo, Primer Ciclo, Kinder", "Complementos": "nombre: Cena, precio: 8.00 <br   >", "Fecha del Evento": "Octubre 23, 2024"}	\N
740	{"ID": "240", "date": "20/10/2024", "table": "events", "title": {"table": "Evento ", "action": "Registrado."}, "Nombre": "Cena de la Familia Chaleca", "Precio": "15.00", "action": "add", "author": "Miguel Ledezma", "Niveles": "Bachillerato, Tercer Ciclo, Segundo Ciclo, Primer Ciclo, Kinder", "Fecha del Evento": "Octubre 23, 2024"}	\N
741	{"ID": "240", "date": "20/10/2024", "table": "events", "title": {"table": "Evento ", "action": "Complementos Editados."}, "action": "editComplements", "author": "Miguel Ledezma", "Complementos": "nombre: Soda, precio: 0.75 <br   >nombre: Crepas, precio: 4.00 <br   >"}	\N
742	{"ID": "241", "date": "20/10/2024", "table": "events", "title": {"table": "Evento ", "action": "Registrado."}, "Nombre": "Cena de la Familia Chaleca", "Precio": "15.00", "action": "add", "author": "Miguel Ledezma", "Niveles": "Bachillerato, Tercer Ciclo, Segundo Ciclo, Primer Ciclo, Kinder", "Complementos": "nombre: Soda, precio: 0.75 <br   >nombre: Cena, precio: 8.00 <br   >", "Fecha del Evento": "Octubre 23, 2024"}	\N
743	{"ID": "242", "date": "20/10/2024", "table": "events", "title": {"table": "Evento ", "action": "Registrado."}, "Nombre": "Cena de la Familia Chaleca", "Precio": "15.00", "action": "add", "author": "Miguel Ledezma", "Niveles": "Bachillerato, Tercer Ciclo, Segundo Ciclo, Primer Ciclo, Kinder", "Complementos": "nombre: Cena, precio: 8.00 <br   >nombre: Papas, precio: 3.00 <br   >nombre: Soda, precio: 0.75 <br   >", "Fecha del Evento": "Octubre 23, 2024"}	\N
744	{"ID": "243", "date": "20/10/2024", "table": "events", "title": {"table": "Evento ", "action": "Registrado."}, "Nombre": "Cena de la Familia Chaleca", "Precio": "15.00", "action": "add", "author": "Miguel Ledezma", "Niveles": "Bachillerato, Tercer Ciclo, Segundo Ciclo, Primer Ciclo, Kinder", "Complementos": "nombre: Cena, precio: 8.00 <br   >nombre: Soda, precio: 0.75 <br   >nombre: Crepas, precio: 3.00 <br   >nombre: Papas Fritas, precio: 3.00 <br   >", "Fecha del Evento": "Noviembre 21, 2024"}	\N
745	{"ID": "244", "date": "20/10/2024", "table": "events", "title": {"table": "Evento ", "action": "Registrado."}, "Nombre": "Cena de la Familia Chaleca", "Precio": "15.00", "action": "add", "author": "Miguel Ledezma", "Niveles": "Bachillerato, Tercer Ciclo, Segundo Ciclo, Primer Ciclo, Kinder", "Complementos": "nombre: Soda, precio: 0.75 <br   >nombre: Cena, precio: 8.00 <br   >nombre: Papas, precio: 3.00 <br   >nombre: Crepas, precio: 3.00 <br   >", "Fecha del Evento": "Octubre 23, 2024"}	\N
746	{"ID": "245", "date": "20/10/2024", "table": "events", "title": {"table": "Evento ", "action": "Registrado."}, "Nombre": "Cena de la Familia Chaleca", "Precio": "15.00", "action": "add", "author": "Miguel Ledezma", "Niveles": "Bachillerato, Tercer Ciclo, Segundo Ciclo, Primer Ciclo, Kinder", "Complementos": "nombre: Soda, precio: 0.75 <br   >nombre: Crepas, precio: 3.00 <br   >", "Fecha del Evento": "Octubre 23, 2024"}	\N
747	{"ID": "245", "date": "20/10/2024", "table": "events", "title": {"table": "Evento ", "action": "Complementos Editados."}, "action": "editComplements", "author": "Miguel Ledezma", "Complementos": "nombre: Soda, precio: 0.75 <br   >nombre: Crepas, precio: 3.00 <br   >nombre: Papas, precio: 3.00 <br   >nombre: Cena, precio: 8.00 <br   >"}	\N
748	{"ID": "246", "date": "20/10/2024", "table": "events", "title": {"table": "Evento ", "action": "Registrado."}, "Nombre": "Cena de la Familia Chaleca", "Precio": "15.00", "action": "add", "author": "Miguel Ledezma", "Niveles": "Bachillerato, Tercer Ciclo, Segundo Ciclo, Primer Ciclo, Kinder", "Complementos": "nombre: Soda, precio: 0.75 <br   >nombre: Crepas, precio: 3.00 <br   >nombre: Papas, precio: 3.00 <br   >nombre: Cena, precio: 8.00 <br   >", "Fecha del Evento": "Octubre 23, 2024"}	\N
749	{"ID": "247", "date": "20/10/2024", "table": "events", "title": {"table": "Evento ", "action": "Registrado."}, "Nombre": "Cena de la Familia Chaleca", "Precio": "15.00", "action": "add", "author": "Miguel Ledezma", "Niveles": "Bachillerato, Tercer Ciclo, Segundo Ciclo, Primer Ciclo, Kinder", "Complementos": "nombre: Soda, precio: 0.75 <br   >nombre: Cena, precio: 8.00 <br   >nombre: Crepas, precio: 3.00 <br   >nombre: Papas, precio: 3.00 <br   >nombre: Tacos, precio: 5.00 <br   >", "Fecha del Evento": "Octubre 23, 2024"}	\N
750	{"ID": "248", "date": "20/10/2024", "table": "events", "title": {"table": "Evento ", "action": "Registrado."}, "Nombre": "Cena de la Familia Chaleca", "Precio": "15.00", "action": "add", "author": "Miguel Ledezma", "Niveles": "Bachillerato, Tercer Ciclo, Segundo Ciclo, Primer Ciclo, Kinder", "Fecha del Evento": "Octubre 23, 2024"}	\N
751	{"ID": "248", "date": "20/10/2024", "table": "events", "title": {"table": "Evento ", "action": "Complementos Editados."}, "action": "editComplements", "author": "Miguel Ledezma", "Complementos": "nombre: Cena, precio: 8.00 <br   >nombre: Crepas, precio: 3.00 <br   >nombre: Pupusas, precio: 1.25 <br   >"}	\N
752	{"ID": "248", "date": "20/10/2024", "table": "events", "title": {"table": "Evento ", "action": "Complementos Editados."}, "action": "editComplements", "author": "Miguel Ledezma", "Complementos": "nombre: Cena, precio: 8.00 <br   >nombre: Pupusas, precio: 1.25 <br   >"}	\N
753	{"ID": "249", "date": "20/10/2024", "table": "events", "title": {"table": "Evento ", "action": "Registrado."}, "Nombre": "Cena de la Familia Chaleca", "Precio": "15.00", "action": "add", "author": "Miguel Ledezma", "Niveles": "Bachillerato, Tercer Ciclo, Segundo Ciclo, Primer Ciclo, Kinder", "Complementos": "nombre: Soda, precio: 0.75 <br   >nombre: Cena, precio: 8.00 <br   >nombre: Tacos, precio: 5.00 <br   >nombre: Papas, precio: 3.00 <br   >nombre: Crepas, precio: 3.00 <br   >", "Fecha del Evento": "Octubre 23, 2024"}	\N
754	{"ID": "250", "date": "20/10/2024", "table": "events", "title": {"table": "Evento ", "action": "Registrado."}, "Nombre": "Cena de la Familia Chaleca", "Precio": "15.00", "action": "add", "author": "Miguel Ledezma", "Niveles": "Bachillerato, Tercer Ciclo, Segundo Ciclo, Primer Ciclo, Kinder", "Complementos": "nombre: Cena, precio: 8.00 <br   >nombre: Soda, precio: 0.75 <br   >nombre: Papas, precio: 3.00 <br   >nombre: Crepas, precio: 3.00 <br   >nombre: Tacos, precio: 5.00 <br   >", "Fecha del Evento": "Octubre 23, 2024"}	\N
755	{"ID": "251", "date": "21/10/2024", "table": "events", "title": {"table": "Evento ", "action": "Registrado."}, "Nombre": "Cena de la Familia Chaleca", "Precio": "15.00", "action": "add", "author": "Miguel Ledezma", "Niveles": "Bachillerato, Tercer Ciclo, Segundo Ciclo, Primer Ciclo, Kinder", "Complementos": "nombre: Cena, precio: 8.00 <br   >nombre: Tacos, precio: 5.00 <br   >nombre: Crepas, precio: 3.00 <br   >nombre: Papita, precio: 3.00 <br   >", "Fecha del Evento": "Octubre 23, 2024"}	\N
756	{"ID": "251", "date": "21/10/2024", "table": "events", "title": {"table": "Evento ", "action": "Complementos Editados."}, "action": "editComplements", "author": "Miguel Ledezma", "Complementos": ""}	\N
757	{"ID": "251", "date": "21/10/2024", "table": "events", "title": {"table": "Evento ", "action": "Complementos Editados."}, "action": "editComplements", "author": "Miguel Ledezma", "Complementos": "nombre: Cena, precio: 8.00 <br   >nombre: Soda, precio: 0.75 <br   >nombre: Crepas, precio: 3.00 <br   >nombre: Papas, precio: 3.00 <br   >nombre: Tacos, precio: 5.00 <br   >"}	\N
758	{"ID": "252", "date": "21/10/2024", "table": "events", "title": {"table": "Evento ", "action": "Registrado."}, "Nombre": "Cena de la Familia Chaleca", "Precio": "15.00", "action": "add", "author": "Miguel Ledezma", "Niveles": "Bachillerato, Tercer Ciclo, Segundo Ciclo, Primer Ciclo, Kinder", "Complementos": "nombre: Cena, precio: 8.00 <br   >nombre: Soda, precio: 0.75 <br   >nombre: Papas Fritas, precio: 3.00 <br   >nombre: Crepas, precio: 3.00 <br   >nombre: Tacos, precio: 5.00 <br   >", "Fecha del Evento": "Octubre 23, 2024"}	\N
759	{"ID": "253", "date": "21/10/2024", "table": "events", "title": {"table": "Evento ", "action": "Registrado."}, "Nombre": "Fiesta Intramuros", "Precio": "15.00", "action": "add", "author": "Miguel Ledezma", "Niveles": "Bachillerato, Tercer Ciclo, Segundo Ciclo, Primer Ciclo, Kinder", "Complementos": "nombre: Tacos , precio: 5.00 <br   >nombre: Tortas , precio: 6.00 <br   >", "Fecha del Evento": "Octubre 26, 2024"}	\N
760	{"ID": "26", "Rol": "Digitador/a", "date": "21/10/2024", "table": "users", "title": {"table": "Usuario ", "action": "Modificado."}, "Correo": "20110019@santacecilia.edu.sv", "Imagen": "Miguel_Ledezma_8894.png", "Nombre": "Miguel Orlando ", "action": "edit", "author": "Miguel Ledezma", "Apellido": "Ledezma Arévalo"}	\N
761	{"ID": "254", "date": "22/10/2024", "table": "events", "title": {"table": "Evento ", "action": "Registrado."}, "Nombre": "Cena de la Familia Chaleca", "Precio": "15.00", "action": "add", "author": "Miguel Orlando  Ledezma Arévalo", "Niveles": "Bachillerato, Tercer Ciclo, Segundo Ciclo, Primer Ciclo, Kinder", "Complementos": "nombre: Cena, precio: 8.00 <br   >nombre: Crepas, precio: 5.00 <br   >nombre: Soda, precio: 0.75 <br   >nombre: Papas Fritas, precio: 3.00 <br   >nombre: Tacos, precio: 5.00 <br   >", "Fecha del Evento": "Octubre 24, 2024"}	\N
762	{"ID": "255", "date": "22/10/2024", "table": "events", "title": {"table": "Evento ", "action": "Registrado."}, "Nombre": "Fiesta de Intramuros", "Precio": "15.00", "action": "add", "author": "Miguel Orlando  Ledezma Arévalo", "Niveles": "Bachillerato, Tercer Ciclo, Segundo Ciclo, Primer Ciclo, Kinder", "Complementos": "nombre: Cena, precio: 8.00 <br   >nombre: Crepas, precio: 3.00 <br   >nombre: Soda, precio: 0.75 <br   >nombre: Papas Fritas, precio: 3.00 <br   >", "Fecha del Evento": "Octubre 24, 2024"}	\N
763	{"ID": "256", "date": "23/10/2024", "table": "events", "title": {"table": "Evento ", "action": "Registrado."}, "Nombre": "Cena de la Familia Chaleca", "Precio": "15.00", "action": "add", "author": "Miguel Orlando  Ledezma Arévalo", "Niveles": "Bachillerato, Tercer Ciclo, Segundo Ciclo, Primer Ciclo, Kinder", "Complementos": "nombre: Cena, precio: 8.00 <br   >", "Fecha del Evento": "Octubre 25, 2024"}	\N
764	{"ID": "256", "date": "23/10/2024", "table": "events", "title": {"table": "Evento ", "action": "Complementos Editados."}, "action": "editComplements", "author": "Miguel Orlando  Ledezma Arévalo", "Complementos": "nombre: Cena, precio: 8.00 <br   >nombre: Soda, precio: 0.75 <br   >nombre: Crepas, precio: 3.00 <br   >nombre: Papas, precio: 3.00 <br   >nombre: Tacos, precio: 5.00 <br   >nombre: Tortas, precio: 5.00 <br   >"}	\N
765	{"ID": "4", "Rol": "Super Administrador", "date": "23/10/2024", "table": "users", "title": {"table": "Usuario ", "action": "Modificado."}, "Correo": "Administrador@santacecilia.edu.sv", "Imagen": "temp_img.png", "Nombre": "Administrador", "action": "edit", "author": "Miguel Orlando  Ledezma Arévalo", "Apellido": "CSSC"}	\N
766	{"ID": "257", "date": "24/10/2024", "table": "events", "title": {"table": "Evento ", "action": "Registrado."}, "Nombre": "Cena de la Familia Chaleca", "Precio": "15.00", "action": "add", "author": "Miguel Orlando  Ledezma Arévalo", "Niveles": "Bachillerato, Tercer Ciclo, Segundo Ciclo, Primer Ciclo, Kinder", "Complementos": "nombre: Cena, precio: 8.00 <br   >nombre: Papas, precio: 3.00 <br   >nombre: Crepas, precio: 3.00 <br   >nombre: Soda, precio: 0.75 <br   >nombre: Tacos, precio: 4 <br   >nombre: Tortas, precio: 4.00 <br   >", "Fecha del Evento": "Octubre 25, 2024"}	\N
767	{"ID": "258", "date": "24/10/2024", "table": "events", "title": {"table": "Evento ", "action": "Registrado."}, "Nombre": "Cena de la Familia Chaleca", "Precio": "15.00", "action": "add", "author": "Miguel Orlando  Ledezma Arévalo", "Niveles": "Bachillerato, Tercer Ciclo, Segundo Ciclo, Primer Ciclo, Kinder", "Complementos": "nombre: Cena, precio: 8.00 <br   >nombre: Crepas, precio: 3.00 <br   >nombre: Tacos, precio: 3.00 <br   >nombre: Soda, precio: 0.75 <br   >nombre: Tortas, precio: 3.00 <br   >", "Fecha del Evento": "Octubre 28, 2024"}	\N
768	{"ID": "74", "date": "24/10/2024", "table": "roles", "title": {"table": "Rol ", "action": "Modificado."}, "Nombre": "Finanzas", "action": "edit", "author": "Administrador CSSC", "Permisos": "Listar Eventos, Gestion y Analisis"}	\N
769	{"ID": "4", "Rol": "Digitador/a", "date": "24/10/2024", "table": "users", "title": {"table": "Usuario ", "action": "Modificado."}, "Correo": "Administrador@santacecilia.edu.sv", "Imagen": "temp_img.png", "Nombre": "Administrador", "action": "edit", "author": "Miguel Orlando  Ledezma Arévalo", "Apellido": "CSSC"}	\N
770	{"ID": "44", "Rol": "Super Administrador", "date": "24/10/2024", "table": "users", "title": {"table": "Usuario ", "action": "Modificado."}, "Correo": "felix.masin@santacecilia.edu.sv", "Imagen": "Felix_Masín_6218.png", "Nombre": "Felix", "action": "edit", "author": "Administrador CSSC", "Apellido": "Masín"}	\N
771	{"ID": "43", "Rol": "Super Administrador", "date": "24/10/2024", "table": "users", "title": {"table": "Usuario ", "action": "Modificado."}, "Correo": "emmanuel.posada@santacecilia.edu.sv", "Imagen": "Emmanuel Enrique_Posada_3709.png", "Nombre": "Emmanuel Enrique", "action": "edit", "author": "Administrador CSSC", "Apellido": "Posada"}	\N
772	{"ID": "40", "Rol": "Super Administrador", "date": "24/10/2024", "table": "users", "title": {"table": "Usuario ", "action": "Modificado."}, "Correo": "luis.torres@santacecilia.edu.sv", "Imagen": "Luis Raúl_Torres Hernández_5295.png", "Nombre": "Luis Raúl", "action": "edit", "author": "Administrador CSSC", "Apellido": "Torres Hernández"}	\N
773	{"ID": "26", "Rol": "Super Administrador", "date": "24/10/2024", "table": "users", "title": {"table": "Usuario ", "action": "Modificado."}, "Correo": "20110019@santacecilia.edu.sv", "Imagen": "Miguel_Ledezma_8894.png", "Nombre": "Miguel Orlando ", "action": "edit", "author": "Administrador CSSC", "Apellido": "Ledezma Arévalo"}	\N
774	{"ID": "4", "Rol": "Super Administrador", "date": "24/10/2024", "table": "users", "title": {"table": "Usuario ", "action": "Modificado."}, "Correo": "Administrador@santacecilia.edu.sv", "Imagen": "temp_img.png", "Nombre": "Administrador", "action": "edit", "author": "Miguel Orlando  Ledezma Arévalo", "Apellido": "CSSC"}	\N
775	{"ID": "45", "date": "24/10/2024", "table": "users", "title": {"table": "Usuario ", "action": "Rehabilitado."}, "Nombre": "Eunice Castres", "Razón": "Prueha", "action": "rehabilitate", "author": "Miguel Orlando  Ledezma Arévalo"}	\N
776	{"ID": "45", "Rol": "Super Administrador", "date": "24/10/2024", "table": "users", "title": {"table": "Usuario ", "action": "Modificado."}, "Correo": "eunice.castro@santacecilia.edu.sv", "Imagen": "Eunice_Castro_3441.png", "Nombre": "Eunice", "action": "edit", "author": "Miguel Orlando  Ledezma Arévalo", "Apellido": "Castres"}	\N
777	{"ID": "16", "date": "24/10/2024", "Grado": "Noveno Grado", "table": "students", "title": {"table": "Estudiante ", "action": "Modificado."}, "Carnet": "20110015", "Nombre": "Miguel Orlando", "action": "edit", "author": "Miguel Orlando  Ledezma Arévalo", "Apellido": "Ledezma\\tArévalo", "Sección": "B"}	\N
778	{"ID": "32", "date": "24/10/2024", "Grado": "Primer Año", "table": "students", "title": {"table": "Estudiante ", "action": "Modificado."}, "Carnet": "20456151", "Nombre": "Carlos Raúl", "action": "edit", "author": "Miguel Orlando  Ledezma Arévalo", "Apellido": "Ledezma Arévalo", "Sección": "D"}	\N
779	{"ID": "16", "date": "24/10/2024", "Grado": "Noveno Grado", "table": "students", "title": {"table": "Estudiante ", "action": "Modificado."}, "Carnet": "20110015", "Nombre": "Miguel Orlando", "action": "edit", "author": "Miguel Orlando  Ledezma Arévalo", "Apellido": "Ledezma Arévalo", "Sección": "B"}	\N
780	{"ID": "1", "date": "24/10/2024", "table": "roles", "title": {"table": "Rol ", "action": "Modificado."}, "Nombre": "root", "action": "edit", "author": "Miguel Orlando  Ledezma Arévalo", "Permisos": "Administrar Plataforma"}	\N
781	{"ID": "45", "Rol": "Finanzas", "date": "24/10/2024", "table": "users", "title": {"table": "Usuario ", "action": "Modificado."}, "Correo": "eunice.castro@santacecilia.edu.sv", "Imagen": "Eunice_Castro_3441.png", "Nombre": "Eunice", "action": "edit", "author": "Miguel Orlando  Ledezma Arévalo", "Apellido": "Castres"}	\N
782	{"ID": "44", "Rol": "Auditor", "date": "24/10/2024", "table": "users", "title": {"table": "Usuario ", "action": "Modificado."}, "Correo": "felix.masin@santacecilia.edu.sv", "Imagen": "Felix_Masín_6218.png", "Nombre": "Felix", "action": "edit", "author": "Miguel Orlando  Ledezma Arévalo", "Apellido": "Masín"}	\N
783	{"ID": "43", "Rol": "Auditor", "date": "24/10/2024", "table": "users", "title": {"table": "Usuario ", "action": "Modificado."}, "Correo": "emmanuel.posada@santacecilia.edu.sv", "Imagen": "Emmanuel Enrique_Posada_3709.png", "Nombre": "Emmanuel Enrique", "action": "edit", "author": "Miguel Orlando  Ledezma Arévalo", "Apellido": "Posada"}	\N
784	{"ID": "40", "Rol": "Digitador/a", "date": "24/10/2024", "table": "users", "title": {"table": "Usuario ", "action": "Modificado."}, "Correo": "luis.torres@santacecilia.edu.sv", "Imagen": "Luis Raúl_Torres Hernández_5295.png", "Nombre": "Luis Raúl", "action": "edit", "author": "Miguel Orlando  Ledezma Arévalo", "Apellido": "Torres Hernández"}	\N
785	{"ID": "44", "Rol": "Analista", "date": "24/10/2024", "table": "users", "title": {"table": "Usuario ", "action": "Modificado."}, "Correo": "felix.masin@santacecilia.edu.sv", "Imagen": "Felix_Masín_6218.png", "Nombre": "Felix", "action": "edit", "author": "Miguel Orlando  Ledezma Arévalo", "Apellido": "Masín"}	\N
786	{"ID": "1", "date": "24/10/2024", "table": "roles", "title": {"table": "Rol ", "action": "Modificado."}, "Nombre": "root", "action": "edit", "author": "Miguel Orlando  Ledezma Arévalo", "Permisos": "Administrar Eventos, Administrar Plataforma"}	\N
787	{"ID": "40", "date": "24/10/2024", "Grado": "Séptimo Grado", "table": "students", "title": {"table": "Estudiante ", "action": "Registrado."}, "Carnet": "20651851", "Nombre": "Alberto Jesús", "action": "add", "author": "Miguel Orlando  Ledezma Arévalo", "Apellido": "Bondanza Marino", "Sección": "B"}	\N
788	{"ID": "41", "date": "24/10/2024", "Grado": "Kinder 4", "table": "students", "title": {"table": "Estudiante ", "action": "Registrado."}, "Carnet": "20524264", "Nombre": "Emiliano Jorge", "action": "add", "author": "Miguel Orlando  Ledezma Arévalo", "Apellido": "Emmanuel Campos", "Sección": "B"}	\N
789	{"ID": "259", "date": "24/10/2024", "table": "events", "title": {"table": "Evento ", "action": "Registrado."}, "Nombre": "Fiesta de Intramuros", "Precio": "15.00", "action": "add", "author": "Miguel Orlando  Ledezma Arévalo", "Niveles": "Bachillerato, Tercer Ciclo, Segundo Ciclo, Primer Ciclo, Kinder", "Complementos": "nombre: Cena, precio: 8.00 <br   >nombre: Soda, precio: 0.75 <br   >nombre: Crepas, precio: 3.00 <br   >nombre: Tacos, precio: 4.00 <br   >nombre: Tortas, precio: 4.00 <br   >", "Fecha del Evento": "Octubre 31, 2024"}	\N
790	{"ID": "260", "date": "24/10/2024", "table": "events", "title": {"table": "Evento ", "action": "Registrado."}, "Nombre": "Fiesta de Semana de Juventud", "Precio": "15.00", "action": "add", "author": "Miguel Orlando  Ledezma Arévalo", "Niveles": "Bachillerato, Tercer Ciclo, Segundo Ciclo, Primer Ciclo, Kinder", "Complementos": "nombre: Soda, precio: 0.75 <br   >nombre: Crepas, precio: 3.00 <br   >nombre: Tacos, precio: 5.00 <br   >nombre: Cena, precio: 8.00 <br   >nombre: Tortas, precio: 4.00 <br   >nombre: Papas Fritas, precio: 5.00 <br   >", "Fecha del Evento": "Noviembre 15, 2024"}	\N
791	{"ID": "259", "date": "24/10/2024", "table": "events", "title": {"table": "Evento ", "action": "Complementos Editados."}, "action": "editComplements", "author": "Miguel Orlando  Ledezma Arévalo", "Complementos": "nombre: Cena, precio: 8.00 <br   >nombre: Soda, precio: 0.75 <br   >nombre: Crepas, precio: 3.00 <br   >nombre: Tacos, precio: 4.00 <br   >nombre: Tortas, precio: 4.00 <br   >nombre: Papas Fritas, precio: 3.00 <br   >"}	\N
792	{"ID": "45", "Rol": "Finanzas", "date": "24/10/2024", "table": "users", "title": {"table": "Usuario ", "action": "Modificado."}, "Correo": "eunice.castro@santacecilia.edu.sv", "Imagen": "Eunice_Castro_3441.png", "Nombre": "Eunice", "action": "edit", "author": "Miguel Orlando  Ledezma Arévalo", "Apellido": "Castro"}	\N
793	{"ID": "4", "date": "24/10/2024", "table": "roles", "title": {"table": "Rol ", "action": "Modificado."}, "Nombre": "Digitador/a", "action": "edit", "author": "Miguel Orlando  Ledezma Arévalo", "Permisos": "Gestión y Análisis de Evento, Listado de Devolución de Tarjetas, Cerrar Evento, Caja de Ventas, Canjeo, Iniciar Evento, Listado de Entrega de Tarjetas, Preventa de Tarjetas, Inicializar Evento"}	\N
794	{"ID": "4", "date": "24/10/2024", "table": "roles", "title": {"table": "Rol ", "action": "Modificado."}, "Nombre": "Digitador/a del Evento", "action": "edit", "author": "Miguel Orlando  Ledezma Arévalo", "Permisos": "Gestión y Análisis de Evento, Listado de Devolución de Tarjetas, Cerrar Evento, Caja de Ventas, Canjeo, Iniciar Evento, Listado de Entrega de Tarjetas, Preventa de Tarjetas, Inicializar Evento"}	\N
795	{"ID": "4", "date": "24/10/2024", "table": "roles", "title": {"table": "Rol ", "action": "Modificado."}, "Nombre": "Digitador/a del Evento", "action": "edit", "author": "Miguel Orlando  Ledezma Arévalo", "Permisos": "Listado de Devolución de Tarjetas, Cerrar Evento, Iniciar Evento, Listado de Entrega de Tarjetas, Inicializar Evento"}	\N
796	{"ID": "3", "date": "24/10/2024", "table": "roles", "title": {"table": "Rol ", "action": "Modificado."}, "Nombre": "Analista", "action": "edit", "author": "Miguel Orlando  Ledezma Arévalo", "Permisos": "Gestión y Análisis de Evento, Listado de Devolución de Tarjetas, Listado de Entrega de Tarjetas, Listar Grados, Listar Usuarios, Listar Eventos, Listar Niveles, Listar Roles, Listar Estudiantes, Gestion y Analisis"}	\N
797	{"ID": "2", "date": "24/10/2024", "table": "roles", "title": {"table": "Rol ", "action": "Modificado."}, "Nombre": "Finanzas", "action": "edit", "author": "Miguel Orlando  Ledezma Arévalo", "Permisos": "Gestión y Análisis de Evento, Caja de Ventas, Preventa de Tarjetas, Listar Eventos, Gestion y Analisis"}	\N
798	{"ID": "4", "date": "24/10/2024", "table": "roles", "title": {"table": "Rol ", "action": "Modificado."}, "Nombre": "Digitador/a para Eventos", "action": "edit", "author": "Miguel Orlando  Ledezma Arévalo", "Permisos": "Listado de Devolución de Tarjetas, Cerrar Evento, Iniciar Evento, Listado de Entrega de Tarjetas, Inicializar Evento"}	\N
799	{"ID": "106", "date": "24/10/2024", "table": "roles", "title": {"table": "Rol ", "action": "Registrado."}, "Nombre": "Digitador Plataforma", "action": "add", "author": "Miguel Orlando  Ledezma Arévalo", "Permisos": "Administrar Grados, Administrar Usuarios, Administrar Eventos, Administrar Niveles, Administrar Roles, Administrar Estudiantes"}	\N
800	{"ID": "4", "date": "24/10/2024", "table": "roles", "title": {"table": "Rol ", "action": "Modificado."}, "Nombre": "Digitado Eventos", "action": "edit", "author": "Miguel Orlando  Ledezma Arévalo", "Permisos": "Listado de Devolución de Tarjetas, Cerrar Evento, Iniciar Evento, Listado de Entrega de Tarjetas, Inicializar Evento"}	\N
801	{"ID": "4", "date": "24/10/2024", "table": "roles", "title": {"table": "Rol ", "action": "Modificado."}, "Nombre": "Digitador Eventos", "action": "edit", "author": "Miguel Orlando  Ledezma Arévalo", "Permisos": "Listado de Devolución de Tarjetas, Cerrar Evento, Iniciar Evento, Listado de Entrega de Tarjetas, Inicializar Evento"}	\N
802	{"ID": "5", "date": "24/10/2024", "table": "roles", "title": {"table": "Rol ", "action": "Modificado."}, "Nombre": "Auditor", "action": "edit", "author": "Miguel Orlando  Ledezma Arévalo", "Permisos": "Gestión y Análisis de Evento, Listado de Devolución de Tarjetas, Listado de Entrega de Tarjetas, Listar Grados, Listar Usuarios, Listar Eventos, Listar Niveles, Listar Roles, Listar Estudiantes"}	\N
803	{"ID": "26", "Rol": "Digitador Plataforma", "date": "24/10/2024", "table": "users", "title": {"table": "Usuario ", "action": "Modificado."}, "Correo": "20110019@santacecilia.edu.sv", "Imagen": "Miguel_Ledezma_8894.png", "Nombre": "Miguel Orlando ", "action": "edit", "author": "Miguel Orlando  Ledezma Arévalo", "Apellido": "Ledezma Arévalo"}	\N
804	{"ID": "1", "date": "24/10/2024", "table": "roles", "title": {"table": "Rol ", "action": "Modificado."}, "Nombre": "root", "action": "edit", "author": "Administrador CSSC", "Permisos": "Gestión y Análisis de Evento, Administrar Modulos de Eventos, Gestion y Analisis, Administrar Plataforma"}	\N
805	{"ID": "4", "date": "24/10/2024", "table": "roles", "title": {"table": "Rol ", "action": "Modificado."}, "Nombre": "Digitador Eventos", "action": "edit", "author": "Administrador CSSC", "Permisos": "Listado de Devolución de Tarjetas, Cerrar Evento, Iniciar Evento, Listado de Entrega de Tarjetas, Inicializar Evento, Listar Eventos"}	\N
806	{"ID": "3", "date": "24/10/2024", "table": "roles", "title": {"table": "Rol ", "action": "Modificado."}, "Nombre": "Analista", "action": "edit", "author": "Administrador CSSC", "Permisos": "Cerrar Evento"}	\N
807	{"ID": "2", "date": "24/10/2024", "table": "roles", "title": {"table": "Rol ", "action": "Modificado."}, "Nombre": "Finanzas", "action": "edit", "author": "Administrador CSSC", "Permisos": "Gestión y Análisis de Evento, Listar Eventos, Gestion y Analisis"}	\N
808	{"ID": "3", "date": "24/10/2024", "table": "roles", "title": {"table": "Rol ", "action": "Modificado."}, "Nombre": "Analista", "action": "edit", "author": "Administrador CSSC", "Permisos": "Gestión y Análisis de Evento, Gestion y Analisis"}	\N
809	{"ID": "3", "date": "24/10/2024", "table": "roles", "title": {"table": "Rol ", "action": "Modificado."}, "Nombre": "Analista", "action": "edit", "author": "Administrador CSSC", "Permisos": "Gestión y Análisis de Evento, Listar Eventos, Gestion y Analisis"}	\N
810	{"ID": "26", "Rol": "Digitador Plataforma", "date": "25/10/2024", "table": "users", "title": {"table": "Usuario ", "action": "Modificado."}, "Correo": "20110019@santacecilia.edu.sv", "Nombre": "Miguel Orlando ", "action": "edit", "author": "Administrador CSSC", "Apellido": "Ledezma Arévalo"}	\N
811	{"ID": "261", "date": "25/10/2024", "table": "events", "title": {"table": "Evento ", "action": "Registrado."}, "Nombre": "Cena de la Familia Chaleca", "Precio": "15.00", "action": "add", "author": "Administrador CSSC", "Niveles": "Bachillerato, Tercer Ciclo, Segundo Ciclo, Primer Ciclo, Kinder", "Complementos": "nombre: Cena, precio: 8.00 <br   >nombre: Tacos, precio: 5.00 <br   >nombre: Crepas, precio: 3.00 <br   >nombre: Pupusas, precio: 1.00 <br   >nombre: Tortas, precio: 4.00 <br   >", "Fecha del Evento": "Octubre 31, 2024"}	\N
812	{"ID": "261", "date": "25/10/2024", "table": "events", "title": {"table": "Evento ", "action": "Complementos Editados."}, "action": "editComplements", "author": "Administrador CSSC", "Complementos": "nombre: Cena, precio: 8.00 <br   >nombre: Tacos, precio: 5.00 <br   >nombre: Crepas, precio: 3.00 <br   >nombre: Pupusas, precio: 1.00 <br   >nombre: Tortas, precio: 4.00 <br   >nombre: Soda, precio: 0.75 <br   >"}	\N
813	{"ID": "262", "date": "25/10/2024", "table": "events", "title": {"table": "Evento ", "action": "Registrado."}, "Nombre": "Cena de la Familia Chaleca", "Precio": "15", "action": "add", "author": "Administrador CSSC", "Niveles": "Kinder", "Fecha del Evento": "Octubre 30, 2024"}	\N
814	{"ID": "263", "date": "25/10/2024", "table": "events", "title": {"table": "Evento ", "action": "Registrado."}, "Nombre": "Cena de la Familia Chaleca", "Precio": "15.00", "action": "add", "author": "Administrador CSSC", "Niveles": "Kinder", "Fecha del Evento": "Octubre 30, 2024"}	\N
815	{"ID": "264", "date": "25/10/2024", "table": "events", "title": {"table": "Evento ", "action": "Registrado."}, "Nombre": "Cena de la Familia Chaleca", "Precio": "15.00", "action": "add", "author": "Administrador CSSC", "Niveles": "Kinder", "Fecha del Evento": "Noviembre 08, 2024"}	\N
816	{"ID": "106", "date": "28/10/2024", "table": "roles", "title": {"table": "Rol ", "action": "Modificado."}, "Nombre": "Digitador Plataforma", "action": "edit", "author": "Administrador CSSC", "Permisos": "Listar Grados, Listar Usuarios, Listar Eventos, Listar Niveles, Listar Roles, Listar Estudiantes"}	\N
817	{"ID": "106", "date": "28/10/2024", "table": "roles", "title": {"table": "Rol ", "action": "Modificado."}, "Nombre": "Digitador Plataforma", "action": "edit", "author": "Administrador CSSC", "Permisos": "Listar Usuarios, Listar Eventos, Listar Niveles, Listar Roles, Listar Estudiantes"}	\N
818	{"ID": "106", "date": "28/10/2024", "table": "roles", "title": {"table": "Rol ", "action": "Modificado."}, "Nombre": "Digitador Plataforma", "action": "edit", "author": "Administrador CSSC", "Permisos": "Cerrar Evento"}	\N
819	{"ID": "106", "date": "28/10/2024", "table": "roles", "title": {"table": "Rol ", "action": "Modificado."}, "Nombre": "Digitador Plataforma", "action": "edit", "author": "Administrador CSSC", "Permisos": "Revisión de Estudiantes, Listar Eventos"}	\N
820	{"ID": "106", "date": "28/10/2024", "table": "roles", "title": {"table": "Rol ", "action": "Modificado."}, "Nombre": "Digitador Plataforma", "action": "edit", "author": "Administrador CSSC", "Permisos": "Pago por Estudiantes, Listar Eventos"}	\N
821	{"ID": "106", "date": "28/10/2024", "table": "roles", "title": {"table": "Rol ", "action": "Modificado."}, "Nombre": "Digitador Plataforma", "action": "edit", "author": "Administrador CSSC", "Permisos": "Listar Grados, Listar Usuarios, Listar Eventos, Listar Niveles, Listar Roles, Listar Estudiantes"}	\N
822	{"ID": "1", "date": "29/10/2024", "table": "roles", "title": {"table": "Rol ", "action": "Modificado."}, "Nombre": "root", "action": "edit", "author": "Administrador CSSC", "Permisos": "Gestión y Análisis de Evento, Administrar Módulos de Eventos, Gestión y Análisis, Administrar Plataforma"}	\N
823	{"ID": "1", "date": "29/10/2024", "table": "roles", "title": {"table": "Rol ", "action": "Modificado."}, "Nombre": "root", "action": "edit", "author": "Administrador CSSC", "Permisos": "Gestión y Análisis de Evento, Administrar Módulos de Eventos, Gestión y Análisis, Administrar Plataforma"}	\N
824	{"ID": "106", "date": "29/10/2024", "table": "roles", "title": {"table": "Rol ", "action": "Modificado."}, "Nombre": "Digitador Plataforma", "action": "edit", "author": "Administrador CSSC", "Permisos": "Listar Eventos"}	\N
825	{"ID": "106", "date": "29/10/2024", "table": "roles", "title": {"table": "Rol ", "action": "Modificado."}, "Nombre": "Digitador Plataforma", "action": "edit", "author": "Administrador CSSC", "Permisos": "Análisis del Evento, Revisión de Tarjetas por Estudiante en Evento, Revisión de Tarjetas por Código en Evento, Devolución de Tarjetas, Cerrar Evento, Caja de Ventas, Canjeo de Complementos, Canjeo de Tarjetas, Iniciar Evento, Entrega de Tarjetas, Preventa de Tarjetas, Inicializar Evento, Listar Eventos"}	\N
826	{"ID": "106", "date": "29/10/2024", "table": "roles", "title": {"table": "Rol ", "action": "Modificado."}, "Nombre": "Digitador Plataforma", "action": "edit", "author": "Administrador CSSC", "Permisos": "Administrar Plataforma"}	\N
827	{"ID": "4", "date": "29/10/2024", "table": "roles", "title": {"table": "Rol ", "action": "Modificado."}, "Nombre": "Digitador Eventos", "action": "edit", "author": "Administrador CSSC", "Permisos": "Gestión y Análisis de Evento, Administrar Módulos de Eventos, Listar Eventos"}	\N
828	{"ID": "5", "date": "29/10/2024", "table": "roles", "title": {"table": "Rol ", "action": "Modificado."}, "Nombre": "Auditor", "action": "edit", "author": "Administrador CSSC", "Permisos": "Gestión y Análisis de Evento, Gestión y Análisis, Listar Roles, Listar Usuarios, Listar Niveles, Listar Grados, Listar Estudiantes, Listar Eventos"}	\N
829	{"ID": "3", "date": "29/10/2024", "table": "roles", "title": {"table": "Rol ", "action": "Modificado."}, "Nombre": "Analista", "action": "edit", "author": "Administrador CSSC", "Permisos": "Análisis"}	\N
830	{"ID": "2", "date": "29/10/2024", "table": "roles", "title": {"table": "Rol ", "action": "Modificado."}, "Nombre": "Finanzas", "action": "edit", "author": "Administrador CSSC", "Permisos": "Revisión de Tarjetas por Estudiante en Evento, Pago de Tarjetas por Estudiante, Pago de Tarjetas por Código, Revisión de Tarjetas por Estudiante, Revisión de Tarjetas por Código, Gestión y Análisis"}	\N
831	{"ID": "2", "date": "29/10/2024", "table": "roles", "title": {"table": "Rol ", "action": "Modificado."}, "Nombre": "Finanzas", "action": "edit", "author": "Administrador CSSC", "Permisos": "Revisión de Tarjetas por Estudiante en Evento, Pago de Tarjetas por Estudiante, Pago de Tarjetas por Código, Revisión de Tarjetas por Estudiante, Revisión de Tarjetas por Código"}	\N
832	{"ID": "265", "date": "29/10/2024", "table": "events", "title": {"table": "Evento ", "action": "Registrado."}, "Nombre": "Cena de la Familia Chaleca", "Precio": "15.00", "action": "add", "author": "Administrador CSSC", "Niveles": "Kinder", "Complementos": "nombre: Cena, precio: 8.00 <br   >nombre: Crepas, precio: 3.00 <br   >", "Fecha del Evento": "Octubre 31, 2024"}	\N
833	{"ID": "266", "date": "29/10/2024", "table": "events", "title": {"table": "Evento ", "action": "Registrado."}, "Nombre": "Cena de la Familia Chaleca", "Precio": "15.00", "action": "add", "author": "Administrador CSSC", "Niveles": "Kinder", "Complementos": "nombre: Cena, precio: 8.00 <br   >", "Fecha del Evento": "Octubre 31, 2024"}	\N
834	{"ID": "267", "date": "29/10/2024", "table": "events", "title": {"table": "Evento ", "action": "Registrado."}, "Nombre": "Cena de la Familia Chaleca", "Precio": "15.00", "action": "add", "author": "Administrador CSSC", "Niveles": "Kinder", "Complementos": "nombre: Cena, precio: 8.00 <br   >nombre: tacos, precio: 4.00 <br   >", "Fecha del Evento": "Octubre 31, 2024"}	\N
835	{"ID": "267", "date": "01/11/2024", "table": "events", "title": {"table": "Evento ", "action": "Reconfigurado."}, "Nombre": "Cena de la Familia Chaleca", "Precio": "15.00", "action": "editSettings", "author": "Administrador CSSC", "Niveles": "Bachillerato, Tercer Ciclo, Segundo Ciclo, Primer Ciclo, Kinder", "Fecha del Evento": "Octubre 31, 2024"}	\N
836	{"ID": "268", "date": "01/11/2024", "table": "events", "title": {"table": "Evento ", "action": "Registrado."}, "Nombre": "Cena de la Familia Chaleca", "Precio": "15.00", "action": "add", "author": "Administrador CSSC", "Niveles": "Bachillerato, Tercer Ciclo, Segundo Ciclo, Primer Ciclo, Kinder", "Complementos": "nombre: Cena, precio: 8.00 <br   >nombre: Tacos, precio: 5.00 <br   >nombre: Crepas, precio: 3.00 <br   >", "Fecha del Evento": "Noviembre 14, 2024"}	\N
837	{"ID": "2", "date": "01/11/2024", "table": "roles", "title": {"table": "Rol ", "action": "Modificado."}, "Nombre": "Finanzas", "action": "edit", "author": "Administrador CSSC", "Permisos": "Revisión de Tarjetas por Estudiante en Evento, Pago de Tarjetas por Estudiante, Pago de Tarjetas por Código, Revisión de Tarjetas por Código"}	\N
838	{"ID": "269", "date": "01/11/2024", "table": "events", "title": {"table": "Evento ", "action": "Registrado."}, "Nombre": "Fiesta Navideña", "Precio": "12.00", "action": "add", "author": "Administrador CSSC", "Niveles": "Bachillerato, Tercer Ciclo, Segundo Ciclo, Primer Ciclo, Kinder", "Complementos": "nombre: Cena, precio: 8.00 <br   >nombre: Juegos Para Niño, precio: 1.00 <br   >nombre: Cine, precio: 1.00 <br   >", "Fecha del Evento": "Noviembre 14, 2024"}	\N
839	{"ID": "106", "date": "01/11/2024", "table": "roles", "title": {"table": "Rol ", "action": "Modificado."}, "Nombre": "Digitador Plataforma", "action": "edit", "author": "Administrador CSSC", "Permisos": "Listar Roles, Listar Usuarios, Listar Niveles, Listar Grados, Listar Estudiantes"}	\N
840	{"ID": "106", "date": "01/11/2024", "table": "roles", "title": {"table": "Rol ", "action": "Modificado."}, "Nombre": "Digitador Plataforma", "action": "edit", "author": "Administrador CSSC", "Permisos": "Canjeo de Tarjetas, Listar Eventos"}	\N
841	{"ID": "269", "date": "01/11/2024", "table": "events", "title": {"table": "Evento ", "action": "Inhabilitado."}, "Nombre": "Fiesta Navideña", "Razón": "es una prueba", "action": "disable", "author": "Administrador CSSC"}	\N
\.


--
-- Data for Name: events; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.events (id, name, status, settings, data) FROM stdin;
268	Cena de la Familia Chaleca	Inicializado	{"model": {"type": "", "payed": false, "card_id": "", "exchanged": false, "payedDate": "", "student_id": "", "complements": {"1": {"id": "1", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "2": {"id": "2", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}}, "exchangedDate": ""}, "settings": {"date": "14/11/2024", "price": "15.00", "levels": ["5", "4", "3", "2", "1"], "cardsQtyPerStudent": "3", "forgottenCardPrice": "15.00"}, "complements": {"0": {"id": 0, "price": "8.00", "title": "Cena"}, "1": {"id": 1, "price": "5.00", "title": "Tacos"}, "2": {"id": 2, "price": "3.00", "title": "Crepas"}}}	{"payment": {"00000002": {"date": "01/11/2024 a las 12:32 ", "total": "23", "client": "Felix Araujo", "cashier": "Administrador CSSC", "paymentId": "00000002", "description": "Pago de Tarjeta #857415698574"}}}
269	Fiesta Navideña	Inicializado	{"model": {"type": "", "payed": false, "card_id": "", "exchanged": false, "payedDate": "", "student_id": "", "complements": {"0": {"id": "0", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "1": {"id": "1", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "2": {"id": "2", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}}, "exchangedDate": ""}, "settings": {"date": "14/11/2024", "price": "12.00", "levels": ["5", "4", "3", "2", "1"], "cardsQtyPerStudent": "1", "forgottenCardPrice": "5.00"}, "complements": {"0": {"id": 0, "price": "8.00", "title": "Cena"}, "1": {"id": 1, "price": "1.00", "title": "Juegos Para Niño"}, "2": {"id": 2, "price": "1.00", "title": "Cine"}}}	{"payment": {"00000001": {"date": "01/11/2024 a las 02:27 ", "total": "22", "client": "Miguel", "cashier": "Administrador CSSC", "paymentId": "00000001", "description": "Pago de Tarjeta #9856985"}}}
\.


--
-- Data for Name: grades; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.grades (id, name, status) FROM stdin;
1	Kinder 4	Habilitado
2	Kinder 5	Habilitado
3	Preparatoria	Habilitado
4	Primer Grado	Habilitado
5	Segundo Grado	Habilitado
6	Tercer Grado	Habilitado
7	Cuarto Grado	Habilitado
8	Quinto Grado	Habilitado
9	Sexto Grado	Habilitado
10	Séptimo Grado	Habilitado
11	Octavo Grado	Habilitado
12	Noveno Grado	Habilitado
13	Primer Año	Habilitado
14	Segundo Año	Habilitado
15	Tercer Año	Habilitado
\.


--
-- Data for Name: levels; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.levels (id, name, grades, status) FROM stdin;
2	Primer Ciclo	{6,5,4}	Habilitado
3	Segundo Ciclo	{9,8,7}	Habilitado
4	Tercer Ciclo	{12,11,10}	Habilitado
1	Kinder	{3,2,1}	Habilitado
5	Bachillerato	{15,14,13}	Habilitado
\.


--
-- Data for Name: parentage; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.parentage (id, affiliates) FROM stdin;
\.


--
-- Data for Name: permissions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.permissions (id, name) FROM stdin;
22	Inicializar Evento
21	Administrar Módulos de Eventos
33	Revisión de Tarjetas por Estudiante en Evento
26	Canjeo de Tarjetas
27	Canjeo de Complementos
28	Caja de Ventas
29	Cerrar Evento
30	Devolución de Tarjetas
31	Gestión y Análisis de Evento
34	Análisis del Evento
1	Administrar Plataforma
2	Administrar Eventos
3	Administrar Estudiantes
4	Administrar Grados
5	Administrar Niveles
6	Administrar Usuarios
7	Administrar Roles
8	Listar Eventos
9	Listar Estudiantes
10	Listar Grados
11	Listar Niveles
12	Listar Usuarios
13	Listar Roles
14	Gestión y Análisis
15	Revisión de Tarjetas por Código
16	Revisión de Tarjetas por Estudiante
17	Pago de Tarjetas por Código
18	Pago de Tarjetas por Estudiante
19	Análisis
20	Bitácora de Control
32	Revisión de Tarjetas por Código en Evento
25	Iniciar Evento
24	Entrega de Tarjetas
23	Preventa de Tarjetas
\.


--
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.roles (id, name, permissions_id, status) FROM stdin;
1	root	{31,21,14,1}	Habilitado
4	Digitador Eventos	{31,21,8}	Habilitado
5	Auditor	{31,14,13,12,11,10,9,8}	Habilitado
3	Analista	{19}	Habilitado
2	Finanzas	{33,18,17,15}	Habilitado
106	Digitador Plataforma	{26,8}	Habilitado
\.


--
-- Data for Name: sections; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sections (id, name) FROM stdin;
1	A
2	B
3	C
4	D
5	E
\.


--
-- Data for Name: students; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.students (id, name, carnet, grades, status) FROM stdin;
28	{"Rodrigo Antonio","López López"}	20123131	{15,1}	Habilitado
27	{"Adrián Arnulfo","Martínez Serrano"}	20154862	{2,3}	Habilitado
25	{"Pepe José","Aguilar Sánchez"}	24565189	{14,3}	Habilitado
2	{"Juan Carlos","Gómez Fernández"}	20210065	{7,3}	Habilitado
3	{"Fernando Alberto","Paredes Salgado"}	20200098	{1,1}	Habilitado
4	{"Luis Miguel","Pérez Martínez"}	20170015	{10,1}	Habilitado
39	{"Mario José","Aguilar Flores"}	20641655	{6,1}	Habilitado
6	{"Ana Laura","Ruiz López"}	20230014	{3,2}	Habilitado
10	{"Luis Eduardo","Pérez López"}	20140042	{9,1}	Habilitado
7	{"Carlos José","Jiménez García"}	20170075	{5,3}	Habilitado
5	{"María Elena","Rodríguez Sánchez"}	20220048	{2,3}	Habilitado
8	{"Juan Manuel","Gómez Rodríguez"}	20190015	{6,1}	Habilitado
1	{"Carlos José","Pérez Salazar"}	20210024	{4,2}	Habilitado
9	{"Alejandro José","Sánchez Martínez"}	20200090	{8,1}	Habilitado
32	{"Carlos Raúl","Ledezma Arévalo"}	20456151	{13,4}	Habilitado
11	{"Carlos Alberto","Fernández Ruiz"}	20170023	{11,2}	Habilitado
12	{"Martín Antonio","Jiménez García"}	20150052	{12,2}	Habilitado
15	{"Nicolás Iván","Ruiz López"}	20160032	{10,2}	Habilitado
21	{"Luis Miguel","Hernández Artega"}	20154684	{8,NULL}	Habilitado
31	{"Gustavo Rodrigo","Pacheco Mancía"}	20461561	{14,1}	Habilitado
30	{"Christian Oswaldo","Castellanos Pérez"}	20516514	{15,3}	Habilitado
29	{"Luis Pablo","Ramos Hernández"}	20516515	{13,2}	Habilitado
14	{"Gabriel Alejandro","Pérez Martínez"}	20130025	{8,1}	Habilitado
16	{"Miguel Orlando","Ledezma Arévalo"}	20110015	{12,2}	Habilitado
40	{"Alberto Jesús","Bondanza Marino"}	20651851	{10,2}	Habilitado
13	{"Andrés Felipe","Hernández Sánchez"}	20140051	{9,2}	Habilitado
41	{"Emiliano Jorge","Emmanuel Campos"}	20524264	{1,2}	Habilitado
35	{"Alejandro Antonio","Mendez Marenco"}	20465424	{15,2}	Habilitado
34	{"Andrés Wilfredo","Rodríguez Somoza"}	20516506	{11,3}	Habilitado
36	{"Alan Geraldo",Rivas}	20515424	{14,4}	Habilitado
37	{"William Eduardo","Peraza Navas"}	20345492	{14,3}	Habilitado
17	{"Cesar Adrián","Figueroa Ramos"}	101433	{14,2}	Habilitado
18	{"Gustavo Manuel","Castillo Campos"}	20210120	{11,1}	Habilitado
23	{"José José","Boris Arévalo"}	20204536	{9,3}	Habilitado
26	{"José Carlos","Mendez Osorio"}	21313213	{15,1}	Habilitado
38	{"Rene Fernando","Serrano Cardona"}	20651651	{15,2}	Habilitado
33	{"Angel Andres","Figueroa Moreno"}	20215616	{15,2}	Habilitado
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, name, pass, mail, rol_id, picture, status) FROM stdin;
4	{Administrador,CSSC}	$2y$10$OTTzfkJ6LIdbPsIu/VndE.Ihj18YF59y22Xw0E2eZ6sT0JbfRgTsO	Administrador@santacecilia.edu.sv	1	temp_img.png	Habilitado
43	{"Emmanuel Enrique",Posada}	$2y$10$feQeRkavHJevCvr722cMU.IpjGquGPhNXa873QqzvxkfILMLWmMRC	emmanuel.posada@santacecilia.edu.sv	5	Emmanuel Enrique_Posada_3709.png	Habilitado
40	{"Luis Raúl","Torres Hernández"}	$2y$10$apGR32iV2BHnJ0TSVX4Iw.RtpGIlJIIbErddFQv79t8ObRvkHf4S.	luis.torres@santacecilia.edu.sv	4	Luis Raúl_Torres Hernández_5295.png	Habilitado
44	{Felix,Masín}	$2y$10$MZhHjvIfHZuhUNEG5yhYduiy14GgmLYL5nIimAN004bTva8htBacG	felix.masin@santacecilia.edu.sv	3	Felix_Masín_6218.png	Habilitado
45	{Eunice,Castro}	$2y$10$nZhWKMYMFMkt2Wg.C4jTP.XXcYtDAHZN.zf1AUg1R.9bJYog.Ail6	eunice.castro@santacecilia.edu.sv	2	Eunice_Castro_3441.png	Habilitado
26	{"Miguel Orlando ","Ledezma Arévalo"}	$2y$10$Py3Vmq7YXV0/Bs.QNcldkedscL0wo8yDLUcDmeZMJhorgRL6tc1KW	20110019@santacecilia.edu.sv	106	Miguel Orlando _Ledezma Arévalo_9680.png	Habilitado
\.


--
-- Name: cards_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.cards_id_seq', 1, false);


--
-- Name: control_log_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.control_log_id_seq', 841, true);


--
-- Name: events_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.events_id_seq', 269, true);


--
-- Name: grades_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.grades_id_seq', 21, true);


--
-- Name: levels_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.levels_id_seq', 54, true);


--
-- Name: parentage_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.parentage_id_seq', 1, false);


--
-- Name: permisions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.permisions_id_seq', 58, true);


--
-- Name: roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.roles_id_seq', 106, true);


--
-- Name: sections_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sections_id_seq', 5, true);


--
-- Name: students_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.students_id_seq', 41, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 47, true);


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

