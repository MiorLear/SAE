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
    data jsonb,
    CONSTRAINT status_check CHECK (((status)::text = ANY (ARRAY[('Pendiente de Iniciar'::character varying)::text, ('Inicializado'::character varying)::text, ('En curso'::character varying)::text, ('Finalizado'::character varying)::text, ('Deshabilitado'::character varying)::text, (NULL::character varying)::text])))
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
\.


--
-- Data for Name: events; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.events (id, name, status, settings, data) FROM stdin;
252	Cena de la Familia Chaleca	Inicializado	{"model": {"payed": false, "card_id": "", "returned": false, "exchanged": false, "payedDate": "", "student_id": "", "complements": {"0": {"id": "0", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "3": {"id": "3", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "4": {"id": "4", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}}, "exchangedDate": ""}, "settings": {"date": "23/10/2024", "price": "15.00", "levels": ["5", "4", "3", "2", "1"]}, "complements": {"0": {"id": 0, "price": "8.00", "title": "Cena"}, "1": {"id": 1, "price": "0.75", "title": "Soda"}, "2": {"id": 2, "price": "3.00", "title": "Papas Fritas"}, "3": {"id": 3, "price": "3.00", "title": "Crepas"}, "4": {"id": 4, "price": "5.00", "title": "Tacos"}}}	{"cards": {"1232": {"payed": false, "card_id": "1232", "returned": false, "exchanged": false, "payedDate": "", "student_id": "12", "complements": {"0": {"id": "0", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "3": {"id": "3", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "4": {"id": "4", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}}, "exchangedDate": ""}, "1235": {"payed": false, "card_id": "1235", "returned": false, "exchanged": false, "payedDate": "", "student_id": "10", "complements": {"0": {"id": "0", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "3": {"id": "3", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "4": {"id": "4", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}}, "exchangedDate": ""}, "1262": {"payed": false, "card_id": "1262", "returned": false, "exchanged": false, "payedDate": "", "student_id": "11", "complements": {"0": {"id": "0", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "3": {"id": "3", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "4": {"id": "4", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}}, "exchangedDate": ""}, "2202": {"payed": false, "card_id": "2202", "returned": false, "exchanged": false, "payedDate": "", "student_id": "16", "complements": {"0": {"id": "0", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "3": {"id": "3", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "4": {"id": "4", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}}, "exchangedDate": ""}, "2262": {"payed": false, "card_id": "2262", "returned": false, "exchanged": false, "payedDate": "", "student_id": "37", "complements": {"0": {"id": "0", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "3": {"id": "3", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "4": {"id": "4", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}}, "exchangedDate": ""}, "2515": {"payed": false, "card_id": "2515", "returned": false, "exchanged": false, "payedDate": "", "student_id": "12", "complements": {"0": {"id": "0", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "3": {"id": "3", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "4": {"id": "4", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}}, "exchangedDate": ""}, "2541": {"payed": false, "card_id": "2541", "returned": false, "exchanged": false, "payedDate": "", "student_id": "9", "complements": {"0": {"id": "0", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "3": {"id": "3", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "4": {"id": "4", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}}, "exchangedDate": ""}, "2626": {"payed": false, "card_id": "2626", "returned": false, "exchanged": false, "payedDate": "", "student_id": "32", "complements": {"0": {"id": "0", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "3": {"id": "3", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "4": {"id": "4", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}}, "exchangedDate": ""}, "4151": {"payed": false, "card_id": "4151", "returned": false, "exchanged": false, "payedDate": "", "student_id": "16", "complements": {"0": {"id": "0", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "3": {"id": "3", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "4": {"id": "4", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}}, "exchangedDate": ""}, "4158": {"payed": false, "card_id": "4158", "returned": false, "exchanged": false, "payedDate": "", "student_id": "23", "complements": {"0": {"id": "0", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "3": {"id": "3", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "4": {"id": "4", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}}, "exchangedDate": ""}, "5265": {"payed": false, "card_id": "5265", "returned": false, "exchanged": false, "payedDate": "", "student_id": "26", "complements": {"0": {"id": "0", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "3": {"id": "3", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "4": {"id": "4", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}}, "exchangedDate": ""}, "5412": {"payed": false, "card_id": "5412", "returned": false, "exchanged": false, "payedDate": "", "student_id": "30", "complements": {"0": {"id": "0", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "3": {"id": "3", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "4": {"id": "4", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}}, "exchangedDate": ""}, "5445": {"payed": false, "card_id": "5445", "returned": false, "exchanged": false, "payedDate": "", "student_id": "11", "complements": {"0": {"id": "0", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "3": {"id": "3", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "4": {"id": "4", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}}, "exchangedDate": ""}, "6216": {"payed": false, "card_id": "6216", "returned": false, "exchanged": false, "payedDate": "", "student_id": "6", "complements": {"0": {"id": "0", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "3": {"id": "3", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "4": {"id": "4", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}}, "exchangedDate": ""}, "6262": {"payed": false, "card_id": "6262", "returned": false, "exchanged": false, "payedDate": "", "student_id": "36", "complements": {"0": {"id": "0", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "3": {"id": "3", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "4": {"id": "4", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}}, "exchangedDate": ""}, "6526": {"payed": false, "card_id": "6526", "returned": false, "exchanged": false, "payedDate": "", "student_id": "28", "complements": {"0": {"id": "0", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "3": {"id": "3", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "4": {"id": "4", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}}, "exchangedDate": ""}, "12541": {"payed": false, "card_id": "12541", "returned": false, "exchanged": false, "payedDate": "", "student_id": "8", "complements": {"0": {"id": "0", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "3": {"id": "3", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "4": {"id": "4", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}}, "exchangedDate": ""}, "15451": {"payed": false, "card_id": "15451", "returned": false, "exchanged": false, "payedDate": "", "student_id": "18", "complements": {"0": {"id": "0", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "3": {"id": "3", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "4": {"id": "4", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}}, "exchangedDate": ""}, "15485": {"payed": false, "card_id": "15485", "returned": false, "exchanged": false, "payedDate": "", "student_id": "16", "complements": {"0": {"id": "0", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "3": {"id": "3", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "4": {"id": "4", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}}, "exchangedDate": ""}, "21621": {"payed": false, "card_id": "21621", "returned": false, "exchanged": false, "payedDate": "", "student_id": "17", "complements": {"0": {"id": "0", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "3": {"id": "3", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "4": {"id": "4", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}}, "exchangedDate": ""}, "21963": {"payed": false, "card_id": "21963", "returned": false, "exchanged": false, "payedDate": "", "student_id": "13", "complements": {"0": {"id": "0", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "3": {"id": "3", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "4": {"id": "4", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}}, "exchangedDate": ""}, "22126": {"payed": false, "card_id": "22126", "returned": false, "exchanged": false, "payedDate": "", "student_id": "27", "complements": {"0": {"id": "0", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "3": {"id": "3", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "4": {"id": "4", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}}, "exchangedDate": ""}, "23263": {"payed": false, "card_id": "23263", "returned": false, "exchanged": false, "payedDate": "", "student_id": "10", "complements": {"0": {"id": "0", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "3": {"id": "3", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "4": {"id": "4", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}}, "exchangedDate": ""}, "25841": {"payed": false, "card_id": "25841", "returned": false, "exchanged": false, "payedDate": "", "student_id": "9", "complements": {"0": {"id": "0", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "3": {"id": "3", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "4": {"id": "4", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}}, "exchangedDate": ""}, "25963": {"payed": false, "card_id": "25963", "returned": false, "exchanged": false, "payedDate": "", "student_id": "23", "complements": {"0": {"id": "0", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "3": {"id": "3", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "4": {"id": "4", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}}, "exchangedDate": ""}, "26216": {"payed": false, "card_id": "26216", "returned": false, "exchanged": false, "payedDate": "", "student_id": "6", "complements": {"0": {"id": "0", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "3": {"id": "3", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "4": {"id": "4", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}}, "exchangedDate": ""}, "26262": {"payed": false, "card_id": "26262", "returned": false, "exchanged": false, "payedDate": "", "student_id": "37", "complements": {"0": {"id": "0", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "3": {"id": "3", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "4": {"id": "4", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}}, "exchangedDate": ""}, "26285": {"payed": false, "card_id": "26285", "returned": false, "exchanged": false, "payedDate": "", "student_id": "29", "complements": {"0": {"id": "0", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "3": {"id": "3", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "4": {"id": "4", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}}, "exchangedDate": ""}, "41254": {"payed": false, "card_id": "41254", "returned": false, "exchanged": false, "payedDate": "", "student_id": "8", "complements": {"0": {"id": "0", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "3": {"id": "3", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "4": {"id": "4", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}}, "exchangedDate": ""}, "41258": {"payed": false, "card_id": "41258", "returned": false, "exchanged": false, "payedDate": "", "student_id": "2", "complements": {"0": {"id": "0", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "3": {"id": "3", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "4": {"id": "4", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}}, "exchangedDate": ""}, "41512": {"payed": false, "card_id": "41512", "returned": false, "exchanged": false, "payedDate": "", "student_id": "3", "complements": {"0": {"id": "0", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "3": {"id": "3", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "4": {"id": "4", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}}, "exchangedDate": ""}, "45963": {"payed": false, "card_id": "45963", "returned": false, "exchanged": false, "payedDate": "", "student_id": "13", "complements": {"0": {"id": "0", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "3": {"id": "3", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "4": {"id": "4", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}}, "exchangedDate": ""}, "48415": {"payed": false, "card_id": "48415", "returned": false, "exchanged": false, "payedDate": "", "student_id": "15", "complements": {"0": {"id": "0", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "3": {"id": "3", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "4": {"id": "4", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}}, "exchangedDate": ""}, "51541": {"payed": false, "card_id": "51541", "returned": false, "exchanged": false, "payedDate": "", "student_id": "18", "complements": {"0": {"id": "0", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "3": {"id": "3", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "4": {"id": "4", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}}, "exchangedDate": ""}, "52652": {"payed": false, "card_id": "52652", "returned": false, "exchanged": false, "payedDate": "", "student_id": "31", "complements": {"0": {"id": "0", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "3": {"id": "3", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "4": {"id": "4", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}}, "exchangedDate": ""}, "54896": {"payed": false, "card_id": "54896", "returned": false, "exchanged": false, "payedDate": "", "student_id": "4", "complements": {"0": {"id": "0", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "3": {"id": "3", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "4": {"id": "4", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}}, "exchangedDate": ""}, "62185": {"payed": false, "card_id": "62185", "returned": false, "exchanged": false, "payedDate": "", "student_id": "29", "complements": {"0": {"id": "0", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "3": {"id": "3", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "4": {"id": "4", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}}, "exchangedDate": ""}, "62626": {"payed": false, "card_id": "62626", "returned": false, "exchanged": false, "payedDate": "", "student_id": "25", "complements": {"0": {"id": "0", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "3": {"id": "3", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "4": {"id": "4", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}}, "exchangedDate": ""}, "62652": {"payed": false, "card_id": "62652", "returned": false, "exchanged": false, "payedDate": "", "student_id": "17", "complements": {"0": {"id": "0", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "3": {"id": "3", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "4": {"id": "4", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}}, "exchangedDate": ""}, "65285": {"payed": false, "card_id": "65285", "returned": false, "exchanged": false, "payedDate": "", "student_id": "5", "complements": {"0": {"id": "0", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "3": {"id": "3", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "4": {"id": "4", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}}, "exchangedDate": ""}, "74963": {"payed": false, "card_id": "74963", "returned": false, "exchanged": false, "payedDate": "", "student_id": "23", "complements": {"0": {"id": "0", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "3": {"id": "3", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "4": {"id": "4", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}}, "exchangedDate": ""}, "98745": {"payed": false, "card_id": "98745", "returned": false, "exchanged": false, "payedDate": "", "student_id": "1", "complements": {"0": {"id": "0", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "3": {"id": "3", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "4": {"id": "4", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}}, "exchangedDate": ""}, "125841": {"payed": false, "card_id": "125841", "returned": false, "exchanged": false, "payedDate": "", "student_id": "9", "complements": {"0": {"id": "0", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "3": {"id": "3", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "4": {"id": "4", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}}, "exchangedDate": ""}, "154152": {"payed": false, "card_id": "154152", "returned": false, "exchanged": false, "payedDate": "", "student_id": "34", "complements": {"0": {"id": "0", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "3": {"id": "3", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "4": {"id": "4", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}}, "exchangedDate": ""}, "158741": {"payed": false, "card_id": "158741", "returned": false, "exchanged": false, "payedDate": "", "student_id": "39", "complements": {"0": {"id": "0", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "3": {"id": "3", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "4": {"id": "4", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}}, "exchangedDate": ""}, "212652": {"payed": false, "card_id": "212652", "returned": false, "exchanged": false, "payedDate": "", "student_id": "32", "complements": {"0": {"id": "0", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "3": {"id": "3", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "4": {"id": "4", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}}, "exchangedDate": ""}, "221262": {"payed": false, "card_id": "221262", "returned": false, "exchanged": false, "payedDate": "", "student_id": "5", "complements": {"0": {"id": "0", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "3": {"id": "3", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "4": {"id": "4", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}}, "exchangedDate": ""}, "254125": {"payed": false, "card_id": "254125", "returned": false, "exchanged": false, "payedDate": "", "student_id": "8", "complements": {"0": {"id": "0", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "3": {"id": "3", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "4": {"id": "4", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}}, "exchangedDate": ""}, "258412": {"payed": false, "card_id": "258412", "returned": false, "exchanged": false, "payedDate": "", "student_id": "14", "complements": {"0": {"id": "0", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "3": {"id": "3", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "4": {"id": "4", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}}, "exchangedDate": ""}, "262125": {"payed": false, "card_id": "262125", "returned": false, "exchanged": false, "payedDate": "", "student_id": "34", "complements": {"0": {"id": "0", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "3": {"id": "3", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "4": {"id": "4", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}}, "exchangedDate": ""}, "265126": {"payed": false, "card_id": "265126", "returned": false, "exchanged": false, "payedDate": "", "student_id": "26", "complements": {"0": {"id": "0", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "3": {"id": "3", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "4": {"id": "4", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}}, "exchangedDate": ""}, "412584": {"payed": false, "card_id": "412584", "returned": false, "exchanged": false, "payedDate": "", "student_id": "39", "complements": {"0": {"id": "0", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "3": {"id": "3", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "4": {"id": "4", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}}, "exchangedDate": ""}, "456541": {"payed": false, "card_id": "456541", "returned": false, "exchanged": false, "payedDate": "", "student_id": "10", "complements": {"0": {"id": "0", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "3": {"id": "3", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "4": {"id": "4", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}}, "exchangedDate": ""}, "512512": {"payed": false, "card_id": "512512", "returned": false, "exchanged": false, "payedDate": "", "student_id": "33", "complements": {"0": {"id": "0", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "3": {"id": "3", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "4": {"id": "4", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}}, "exchangedDate": ""}, "521221": {"payed": false, "card_id": "521221", "returned": false, "exchanged": false, "payedDate": "", "student_id": "11", "complements": {"0": {"id": "0", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "3": {"id": "3", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "4": {"id": "4", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}}, "exchangedDate": ""}, "521626": {"payed": false, "card_id": "521626", "returned": false, "exchanged": false, "payedDate": "", "student_id": "37", "complements": {"0": {"id": "0", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "3": {"id": "3", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "4": {"id": "4", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}}, "exchangedDate": ""}, "526526": {"payed": false, "card_id": "526526", "returned": false, "exchanged": false, "payedDate": "", "student_id": "31", "complements": {"0": {"id": "0", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "3": {"id": "3", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "4": {"id": "4", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}}, "exchangedDate": ""}, "541963": {"payed": false, "card_id": "541963", "returned": false, "exchanged": false, "payedDate": "", "student_id": "14", "complements": {"0": {"id": "0", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "3": {"id": "3", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "4": {"id": "4", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}}, "exchangedDate": ""}, "598741": {"payed": false, "card_id": "598741", "returned": false, "exchanged": false, "payedDate": "", "student_id": "1", "complements": {"0": {"id": "0", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "3": {"id": "3", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "4": {"id": "4", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}}, "exchangedDate": ""}, "6+6565": {"payed": false, "card_id": "6+6565", "returned": false, "exchanged": false, "payedDate": "", "student_id": "36", "complements": {"0": {"id": "0", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "3": {"id": "3", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "4": {"id": "4", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}}, "exchangedDate": ""}, "652626": {"payed": false, "card_id": "652626", "returned": false, "exchanged": false, "payedDate": "", "student_id": "31", "complements": {"0": {"id": "0", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "3": {"id": "3", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "4": {"id": "4", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}}, "exchangedDate": ""}, "652651": {"payed": false, "card_id": "652651", "returned": false, "exchanged": false, "payedDate": "", "student_id": "35", "complements": {"0": {"id": "0", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "3": {"id": "3", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "4": {"id": "4", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}}, "exchangedDate": ""}, "741258": {"payed": false, "card_id": "741258", "returned": false, "exchanged": false, "payedDate": "", "student_id": "7", "complements": {"0": {"id": "0", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "3": {"id": "3", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "4": {"id": "4", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}}, "exchangedDate": ""}, "1012541": {"payed": false, "card_id": "1012541", "returned": false, "exchanged": false, "payedDate": "", "student_id": "34", "complements": {"0": {"id": "0", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "3": {"id": "3", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "4": {"id": "4", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}}, "exchangedDate": ""}, "2126212": {"payed": false, "card_id": "2126212", "returned": false, "exchanged": false, "payedDate": "", "student_id": "27", "complements": {"0": {"id": "0", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "3": {"id": "3", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "4": {"id": "4", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}}, "exchangedDate": ""}, "2365125": {"payed": false, "card_id": "2365125", "returned": false, "exchanged": false, "payedDate": "", "student_id": "33", "complements": {"0": {"id": "0", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "3": {"id": "3", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "4": {"id": "4", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}}, "exchangedDate": ""}, "2584158": {"payed": false, "card_id": "2584158", "returned": false, "exchanged": false, "payedDate": "", "student_id": "7", "complements": {"0": {"id": "0", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "3": {"id": "3", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "4": {"id": "4", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}}, "exchangedDate": ""}, "2584587": {"payed": false, "card_id": "2584587", "returned": false, "exchanged": false, "payedDate": "", "student_id": "14", "complements": {"0": {"id": "0", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "3": {"id": "3", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "4": {"id": "4", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}}, "exchangedDate": ""}, "2651251": {"payed": false, "card_id": "2651251", "returned": false, "exchanged": false, "payedDate": "", "student_id": "38", "complements": {"0": {"id": "0", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "3": {"id": "3", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "4": {"id": "4", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}}, "exchangedDate": ""}, "2652126": {"payed": false, "card_id": "2652126", "returned": false, "exchanged": false, "payedDate": "", "student_id": "25", "complements": {"0": {"id": "0", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "3": {"id": "3", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "4": {"id": "4", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}}, "exchangedDate": ""}, "4125126": {"payed": false, "card_id": "4125126", "returned": false, "exchanged": false, "payedDate": "", "student_id": "33", "complements": {"0": {"id": "0", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "3": {"id": "3", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "4": {"id": "4", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}}, "exchangedDate": ""}, "4152125": {"payed": false, "card_id": "4152125", "returned": false, "exchanged": false, "payedDate": "", "student_id": "15", "complements": {"0": {"id": "0", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "3": {"id": "3", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "4": {"id": "4", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}}, "exchangedDate": ""}, "5126512": {"payed": false, "card_id": "5126512", "returned": false, "exchanged": false, "payedDate": "", "student_id": "35", "complements": {"0": {"id": "0", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "3": {"id": "3", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "4": {"id": "4", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}}, "exchangedDate": ""}, "5126526": {"payed": false, "card_id": "5126526", "returned": false, "exchanged": false, "payedDate": "", "student_id": "35", "complements": {"0": {"id": "0", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "3": {"id": "3", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "4": {"id": "4", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}}, "exchangedDate": ""}, "5212521": {"payed": false, "card_id": "5212521", "returned": false, "exchanged": false, "payedDate": "", "student_id": "3", "complements": {"0": {"id": "0", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "3": {"id": "3", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "4": {"id": "4", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}}, "exchangedDate": ""}, "5412512": {"payed": false, "card_id": "5412512", "returned": false, "exchanged": false, "payedDate": "", "student_id": "30", "complements": {"0": {"id": "0", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "3": {"id": "3", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "4": {"id": "4", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}}, "exchangedDate": ""}, "5415212": {"payed": false, "card_id": "5415212", "returned": false, "exchanged": false, "payedDate": "", "student_id": "4", "complements": {"0": {"id": "0", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "3": {"id": "3", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "4": {"id": "4", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}}, "exchangedDate": ""}, "6215874": {"payed": false, "card_id": "6215874", "returned": false, "exchanged": false, "payedDate": "", "student_id": "1", "complements": {"0": {"id": "0", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "3": {"id": "3", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "4": {"id": "4", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}}, "exchangedDate": ""}, "6521652": {"payed": false, "card_id": "6521652", "returned": false, "exchanged": false, "payedDate": "", "student_id": "32", "complements": {"0": {"id": "0", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "3": {"id": "3", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "4": {"id": "4", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}}, "exchangedDate": ""}, "6526521": {"payed": false, "card_id": "6526521", "returned": false, "exchanged": false, "payedDate": "", "student_id": "6", "complements": {"0": {"id": "0", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "3": {"id": "3", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "4": {"id": "4", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}}, "exchangedDate": ""}, "6526626": {"payed": false, "card_id": "6526626", "returned": false, "exchanged": false, "payedDate": "", "student_id": "17", "complements": {"0": {"id": "0", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "3": {"id": "3", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "4": {"id": "4", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}}, "exchangedDate": ""}, "7415874": {"payed": false, "card_id": "7415874", "returned": false, "exchanged": false, "payedDate": "", "student_id": "7", "complements": {"0": {"id": "0", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "3": {"id": "3", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "4": {"id": "4", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}}, "exchangedDate": ""}, "12022125": {"payed": false, "card_id": "12022125", "returned": false, "exchanged": false, "payedDate": "", "student_id": "12", "complements": {"0": {"id": "0", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "3": {"id": "3", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "4": {"id": "4", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}}, "exchangedDate": ""}, "15652652": {"payed": false, "card_id": "15652652", "returned": false, "exchanged": false, "payedDate": "", "student_id": "28", "complements": {"0": {"id": "0", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "3": {"id": "3", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "4": {"id": "4", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}}, "exchangedDate": ""}, "21265212": {"payed": false, "card_id": "21265212", "returned": false, "exchanged": false, "payedDate": "", "student_id": "27", "complements": {"0": {"id": "0", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "3": {"id": "3", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "4": {"id": "4", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}}, "exchangedDate": ""}, "26212626": {"payed": false, "card_id": "26212626", "returned": false, "exchanged": false, "payedDate": "", "student_id": "18", "complements": {"0": {"id": "0", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "3": {"id": "3", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "4": {"id": "4", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}}, "exchangedDate": ""}, "26512651": {"payed": false, "card_id": "26512651", "returned": false, "exchanged": false, "payedDate": "", "student_id": "38", "complements": {"0": {"id": "0", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "3": {"id": "3", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "4": {"id": "4", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}}, "exchangedDate": ""}, "45651256": {"payed": false, "card_id": "45651256", "returned": false, "exchanged": false, "payedDate": "", "student_id": "4", "complements": {"0": {"id": "0", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "3": {"id": "3", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "4": {"id": "4", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}}, "exchangedDate": ""}, "51265126": {"payed": false, "card_id": "51265126", "returned": false, "exchanged": false, "payedDate": "", "student_id": "26", "complements": {"0": {"id": "0", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "3": {"id": "3", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "4": {"id": "4", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}}, "exchangedDate": ""}, "52652963": {"payed": false, "card_id": "52652963", "returned": false, "exchanged": false, "payedDate": "", "student_id": "28", "complements": {"0": {"id": "0", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "3": {"id": "3", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "4": {"id": "4", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}}, "exchangedDate": ""}, "62652852": {"payed": false, "card_id": "62652852", "returned": false, "exchanged": false, "payedDate": "", "student_id": "36", "complements": {"0": {"id": "0", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "3": {"id": "3", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "4": {"id": "4", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}}, "exchangedDate": ""}, "125841265": {"payed": false, "card_id": "125841265", "returned": false, "exchanged": false, "payedDate": "", "student_id": "2", "complements": {"0": {"id": "0", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "3": {"id": "3", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "4": {"id": "4", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}}, "exchangedDate": ""}, "258741258": {"payed": false, "card_id": "258741258", "returned": false, "exchanged": false, "payedDate": "", "student_id": "39", "complements": {"0": {"id": "0", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "3": {"id": "3", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "4": {"id": "4", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}}, "exchangedDate": ""}, "412584852": {"payed": false, "card_id": "412584852", "returned": false, "exchanged": false, "payedDate": "", "student_id": "2", "complements": {"0": {"id": "0", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "3": {"id": "3", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "4": {"id": "4", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}}, "exchangedDate": ""}, "521265156": {"payed": false, "card_id": "521265156", "returned": false, "exchanged": false, "payedDate": "", "student_id": "25", "complements": {"0": {"id": "0", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "3": {"id": "3", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "4": {"id": "4", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}}, "exchangedDate": ""}, "1265414585": {"payed": false, "card_id": "1265414585", "returned": false, "exchanged": false, "payedDate": "", "student_id": "15", "complements": {"0": {"id": "0", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "3": {"id": "3", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "4": {"id": "4", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}}, "exchangedDate": ""}, "5212521852": {"payed": false, "card_id": "5212521852", "returned": false, "exchanged": false, "payedDate": "", "student_id": "5", "complements": {"0": {"id": "0", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "3": {"id": "3", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "4": {"id": "4", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}}, "exchangedDate": ""}, "5412512963": {"payed": false, "card_id": "5412512963", "returned": false, "exchanged": false, "payedDate": "", "student_id": "30", "complements": {"0": {"id": "0", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "3": {"id": "3", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "4": {"id": "4", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}}, "exchangedDate": ""}, "8498456541": {"payed": false, "card_id": "8498456541", "returned": false, "exchanged": false, "payedDate": "", "student_id": "13", "complements": {"0": {"id": "0", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "3": {"id": "3", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "4": {"id": "4", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}}, "exchangedDate": ""}, "15210221256": {"payed": false, "card_id": "15210221256", "returned": false, "exchanged": false, "payedDate": "", "student_id": "3", "complements": {"0": {"id": "0", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "3": {"id": "3", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "4": {"id": "4", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}}, "exchangedDate": ""}, "26212626852": {"payed": false, "card_id": "26212626852", "returned": false, "exchanged": false, "payedDate": "", "student_id": "29", "complements": {"0": {"id": "0", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "3": {"id": "3", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "4": {"id": "4", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}}, "exchangedDate": ""}, "26512651963": {"payed": false, "card_id": "26512651963", "returned": false, "exchanged": false, "payedDate": "", "student_id": "38", "complements": {"0": {"id": "0", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "3": {"id": "3", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "4": {"id": "4", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}}, "exchangedDate": ""}}, "model": {"payed": false, "card_id": "", "returned": false, "exchanged": false, "payedDate": "", "student_id": "", "complements": {"0": {"id": "0", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "3": {"id": "3", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "4": {"id": "4", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}}, "exchangedDate": ""}, "settings": {"date": "23/10/2024", "price": "15.00", "levels": ["5", "4", "3", "2", "1"]}, "complements": {"0": {"id": 0, "price": "8.00", "title": "Cena"}, "1": {"id": 1, "price": "0.75", "title": "Soda"}, "2": {"id": 2, "price": "3.00", "title": "Papas Fritas"}, "3": {"id": 3, "price": "3.00", "title": "Crepas"}, "4": {"id": 4, "price": "5.00", "title": "Tacos"}}}
253	Fiesta Intramuros	Inicializado	{"model": {"payed": false, "card_id": "", "returned": false, "exchanged": false, "payedDate": "", "student_id": "", "complements": {"0": {"id": "0", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}, "1": {"id": "1", "payed": false, "exchanged": false, "payedDate": "", "exchangedDate": ""}}, "exchangedDate": ""}, "settings": {"date": "26/10/2024", "price": "15.00", "levels": ["5", "4", "3", "2", "1"]}, "complements": {"0": {"id": 0, "price": "5.00", "title": "Tacos "}, "1": {"id": 1, "price": "6.00", "title": "Tortas "}}}	\N
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
104	Digitador/a	{1}	Habilitado
47	Super Administrador	{1}	Habilitado
74	Finanzas	{31,2}	Habilitado
76	Auditor	{1}	Habilitado
77	Analista	{2}	Habilitado
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
11	{"Carlos Alberto","Fernández Ruiz"}	20170023	{11,2}	Habilitado
12	{"Martín Antonio","Jiménez García"}	20150052	{12,2}	Habilitado
16	{"Miguel Orlando","Ledezma\tArévalo"}	20110015	{12,2}	Habilitado
15	{"Nicolás Iván","Ruiz López"}	20160032	{10,2}	Habilitado
21	{"Luis Miguel","Hernández Artega"}	20154684	{8,NULL}	Habilitado
31	{"Gustavo Rodrigo","Pacheco Mancía"}	20461561	{14,1}	Habilitado
30	{"Christian Oswaldo","Castellanos Pérez"}	20516514	{15,3}	Habilitado
29	{"Luis Pablo","Ramos Hernández"}	20516515	{13,2}	Habilitado
32	{"Carlos Raúl","Ledezma Arévalo"}	20456151	{13,4}	Habilitado
14	{"Gabriel Alejandro","Pérez Martínez"}	20130025	{8,1}	Habilitado
13	{"Andrés Felipe","Hernández Sánchez"}	20140051	{9,2}	Habilitado
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
4	{Administrador,CSSC}	$2y$10$wiGB9j7vWDk/kE/YJVK2q.qw6ZgJIkwt/gz7N.9If6Uv3.OZnjYDy	Administrador@santacecilia.edu.sv	47	temp_img.png	Habilitado
45	{Eunice,Castres}	$2y$10$nZhWKMYMFMkt2Wg.C4jTP.XXcYtDAHZN.zf1AUg1R.9bJYog.Ail6	eunice.castro@santacecilia.edu.sv	74	Eunice_Castro_3441.png	Deshabilitado
26	{"Miguel Orlando ","Ledezma Arévalo"}	$2y$10$Py3Vmq7YXV0/Bs.QNcldkedscL0wo8yDLUcDmeZMJhorgRL6tc1KW	20110019@santacecilia.edu.sv	104	Miguel_Ledezma_8894.png	Habilitado
40	{"Luis Raúl","Torres Hernández"}	$2y$10$apGR32iV2BHnJ0TSVX4Iw.RtpGIlJIIbErddFQv79t8ObRvkHf4S.	luis.torres@santacecilia.edu.sv	76	Luis Raúl_Torres Hernández_5295.png	Habilitado
43	{"Emmanuel Enrique",Posada}	$2y$10$feQeRkavHJevCvr722cMU.IpjGquGPhNXa873QqzvxkfILMLWmMRC	emmanuel.posada@santacecilia.edu.sv	76	Emmanuel Enrique_Posada_3709.png	Habilitado
44	{Felix,Masín}	$2y$10$MZhHjvIfHZuhUNEG5yhYduiy14GgmLYL5nIimAN004bTva8htBacG	felix.masin@santacecilia.edu.sv	77	Felix_Masín_6218.png	Habilitado
\.


--
-- Name: cards_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.cards_id_seq', 1, false);


--
-- Name: control_log_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.control_log_id_seq', 760, true);


--
-- Name: events_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.events_id_seq', 253, true);


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

SELECT pg_catalog.setval('public.permisions_id_seq', 36, true);


--
-- Name: roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.roles_id_seq', 105, true);


--
-- Name: sections_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sections_id_seq', 5, true);


--
-- Name: students_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.students_id_seq', 39, true);


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

