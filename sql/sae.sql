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
874	{"ID": "270", "date": "10/11/2024", "table": "events", "title": {"table": "Evento", "action": "Inicializado"}, "Evento": "Cena de la Familia Chaleca", "author": "Administrador CSSC"}	\N
875	{"ID": "270", "date": "10/11/2024", "table": "events", "title": {"table": "Evento", "action": "ConFiguración Adicional Realizada"}, "Evento": "Cena de la Familia Chaleca", "author": "Administrador CSSC"}	\N
876	{"ID": "270", "date": "10/11/2024", "table": "events", "title": {"table": "Evento", "action": "Tarjetas Asignadas al Evento"}, "Evento": "Cena de la Familia Chaleca", "author": "Administrador CSSC"}	\N
877	{"ID": "270", "date": "10/11/2024", "table": "events", "title": {"table": "Evento", "action": "Evento Iniciado"}, "Evento": "Cena de la Familia Chaleca", "author": "Administrador CSSC"}	\N
878	{"ID": "270", "date": "10/11/2024", "table": "events", "title": {"table": "Evento", "action": "Evento Finalizado"}, "Evento": "Cena de la Familia Chaleca", "author": "Administrador CSSC"}	\N
879	{"ID": "270", "date": "10/11/2024", "table": "events", "title": {"table": "Evento", "action": "Inicializado"}, "Evento": "Cena de la Familia Chaleca", "author": "Administrador CSSC"}	\N
880	{"ID": "270", "date": "10/11/2024", "table": "events", "title": {"table": "Evento", "action": "Evento Iniciado"}, "Evento": "Cena de la Familia Chaleca", "author": "Administrador CSSC"}	\N
881	{"ID": "270", "date": "10/11/2024", "table": "events", "title": {"table": "Evento ", "action": "Complementos Editados."}, "action": "editComplements", "author": "Administrador CSSC", "Complementos": "nombre: Soda, precio: 0.75 <br   >nombre: Crepas, precio: 3.00 <br   >"}	\N
882	{"ID": "270", "date": "10/11/2024", "table": "events", "title": {"table": "Evento", "action": "Inicializado"}, "Evento": "Cena de la Familia Chaleca", "author": "Administrador CSSC"}	\N
883	{"ID": "270", "date": "10/11/2024", "table": "events", "title": {"table": "Evento", "action": "Inicializado"}, "Evento": "Cena de la Familia Chaleca", "author": "Administrador CSSC"}	\N
884	{"ID": "270", "date": "10/11/2024", "table": "events", "title": {"table": "Evento", "action": "Modelo de Tarjeta Modificado"}, "Evento": "Cena de la Familia Chaleca", "author": "Administrador CSSC"}	\N
885	{"ID": "270", "date": "10/11/2024", "table": "events", "title": {"table": "Evento", "action": "Modelo de Tarjeta Modificado"}, "Evento": "Cena de la Familia Chaleca", "author": "Administrador CSSC"}	\N
886	{"ID": "270", "date": "10/11/2024", "table": "events", "title": {"table": "Evento", "action": "Tarjetas Asignadas al Evento"}, "Evento": "Cena de la Familia Chaleca", "author": "Administrador CSSC"}	\N
887	{"ID": "270", "date": "10/11/2024", "table": "events", "title": {"table": "Evento", "action": "Tarjetas Extra Asignadas al Evento"}, "Evento": "Cena de la Familia Chaleca", "author": "Administrador CSSC"}	\N
888	{"ID": "270", "date": "10/11/2024", "table": "events", "title": {"table": "Evento", "action": "Tarjetas Extra Asignadas al Evento"}, "Evento": "Cena de la Familia Chaleca", "author": "Administrador CSSC"}	\N
889	{"ID": "270", "date": "10/11/2024", "table": "events", "title": {"table": "Evento", "action": "Tarjetas Extra Asignadas al Evento"}, "Evento": "Cena de la Familia Chaleca", "author": "Administrador CSSC"}	\N
890	{"ID": "270", "date": "10/11/2024", "table": "events", "title": {"table": "Evento", "action": "Tarjetas Extra Asignadas al Evento"}, "Evento": "Cena de la Familia Chaleca", "author": "Administrador CSSC"}	\N
891	{"ID": "270", "date": "10/11/2024", "table": "events", "title": {"table": "Evento", "action": "Inicializado"}, "Evento": "Cena de la Familia Chaleca", "author": "Administrador CSSC"}	\N
892	{"ID": "270", "date": "10/11/2024", "table": "events", "title": {"table": "Evento", "action": "Tarjetas Asignadas al Evento"}, "Evento": "Cena de la Familia Chaleca", "author": "Administrador CSSC"}	\N
893	{"ID": "270", "date": "10/11/2024", "table": "events", "title": {"table": "Evento", "action": "Tarjetas Extra Asignadas al Evento"}, "Evento": "Cena de la Familia Chaleca", "author": "Administrador CSSC"}	\N
894	{"ID": "270", "date": "10/11/2024", "table": "events", "title": {"table": "Evento", "action": "Inicializado"}, "Evento": "Cena de la Familia Chaleca", "author": "Administrador CSSC"}	\N
895	{"ID": "270", "date": "10/11/2024", "table": "events", "title": {"table": "Evento", "action": "Tarjetas Asignadas al Evento"}, "Evento": "Cena de la Familia Chaleca", "author": "Administrador CSSC"}	\N
896	{"ID": "270", "date": "10/11/2024", "table": "events", "title": {"table": "Evento", "action": "Tarjetas Extra Asignadas al Evento"}, "Evento": "Cena de la Familia Chaleca", "author": "Administrador CSSC"}	\N
897	{"ID": "271", "date": "10/11/2024", "table": "events", "title": {"table": "Evento ", "action": "Registrado."}, "Nombre": "Fiesta Navideña", "Precio": "15.00", "action": "add", "author": "Administrador CSSC", "Niveles": "Kinder", "Fecha del Evento": "Noviembre 23, 2024"}	\N
898	{"ID": "271", "date": "10/11/2024", "table": "events", "title": {"table": "Evento", "action": "Inicializado"}, "Evento": "Fiesta Navideña", "author": "Administrador CSSC"}	\N
899	{"ID": "271", "date": "10/11/2024", "table": "events", "title": {"table": "Evento", "action": "Configuración Adicional Realizada"}, "Evento": "Fiesta Navideña", "author": "Administrador CSSC"}	\N
900	{"ID": "271", "date": "10/11/2024", "table": "events", "title": {"table": "Evento", "action": "Tarjetas Asignadas al Evento"}, "Evento": "Fiesta Navideña", "author": "Administrador CSSC"}	\N
901	{"ID": "270", "date": "10/11/2024", "table": "events", "title": {"table": "Evento", "action": "Tarjetas Extra Asignadas y Pagadas"}, "Evento": "Cena de la Familia Chaleca", "author": "Administrador CSSC"}	\N
902	{"ID": "270", "date": "10/11/2024", "table": "events", "title": {"table": "Evento", "action": "Tarjetas Extra Asignadas y Pagadas"}, "Evento": "Cena de la Familia Chaleca", "author": "Administrador CSSC"}	\N
903	{"ID": "270", "date": "10/11/2024", "table": "events", "title": {"table": "Evento", "action": "Tarjetas Extra Asignadas y Pagadas"}, "Evento": "Cena de la Familia Chaleca", "author": "Administrador CSSC"}	\N
904	{"ID": "270", "date": "10/11/2024", "table": "events", "title": {"table": "Evento", "action": "Tarjetas Extra Asignadas y Pagadas"}, "Evento": "Cena de la Familia Chaleca", "author": "Administrador CSSC"}	\N
905	{"ID": "272", "date": "10/11/2024", "table": "events", "title": {"table": "Evento ", "action": "Registrado."}, "Nombre": "Cena de la Familia Chaleca", "Precio": "15.00", "action": "add", "author": "Administrador CSSC", "Niveles": "Kinder", "Fecha del Evento": "Noviembre 16, 2024"}	\N
906	{"ID": "272", "date": "10/11/2024", "table": "events", "title": {"table": "Evento ", "action": "Complementos Editados."}, "action": "editComplements", "author": "Administrador CSSC", "Complementos": "nombre: Cena, precio: 8.00 <br   >nombre: Soda, precio: 0.75 <br   >"}	\N
907	{"ID": "273", "date": "10/11/2024", "table": "events", "title": {"table": "Evento ", "action": "Registrado."}, "Nombre": "Fiesta Navideña", "Precio": "15.00", "action": "add", "author": "Administrador CSSC", "Niveles": "Kinder", "Complementos": "nombre: Película, precio: 3.00 <br   >nombre: Galletas, precio: 3.00 <br   >", "Fecha del Evento": "Noviembre 16, 2024"}	\N
908	{"ID": "272", "date": "10/11/2024", "table": "events", "title": {"table": "Evento", "action": "Inicializado"}, "Evento": "Cena de la Familia Chaleca", "author": "Administrador CSSC"}	\N
909	{"ID": "272", "date": "10/11/2024", "table": "events", "title": {"table": "Evento", "action": "Modelo de Tarjeta Modificado"}, "Evento": "Cena de la Familia Chaleca", "author": "Administrador CSSC"}	\N
910	{"ID": "272", "date": "10/11/2024", "table": "events", "title": {"table": "Evento", "action": "Modelo de Tarjeta Modificado"}, "Evento": "Cena de la Familia Chaleca", "author": "Administrador CSSC"}	\N
911	{"ID": "272", "date": "10/11/2024", "table": "events", "title": {"table": "Evento", "action": "Modelo de Tarjeta Modificado"}, "Evento": "Cena de la Familia Chaleca", "author": "Administrador CSSC"}	\N
912	{"ID": "272", "date": "10/11/2024", "table": "events", "title": {"table": "Evento", "action": "Modelo de Tarjeta Modificado"}, "Evento": "Cena de la Familia Chaleca", "author": "Administrador CSSC"}	\N
913	{"ID": "272", "date": "10/11/2024", "table": "events", "title": {"table": "Evento", "action": "Modelo de Tarjeta Modificado"}, "Evento": "Cena de la Familia Chaleca", "author": "Administrador CSSC"}	\N
914	{"ID": "272", "date": "10/11/2024", "table": "events", "title": {"table": "Evento", "action": "Modelo de Tarjeta Modificado"}, "Evento": "Cena de la Familia Chaleca", "author": "Administrador CSSC"}	\N
915	{"ID": "272", "date": "10/11/2024", "table": "events", "title": {"table": "Evento", "action": "Modelo de Tarjeta Modificado"}, "Evento": "Cena de la Familia Chaleca", "author": "Administrador CSSC"}	\N
916	{"ID": "272", "date": "10/11/2024", "table": "events", "title": {"table": "Evento", "action": "Modelo de Tarjeta Modificado"}, "Evento": "Cena de la Familia Chaleca", "author": "Administrador CSSC"}	\N
917	{"ID": "272", "date": "10/11/2024", "table": "events", "title": {"table": "Evento", "action": "Modelo de Tarjeta Modificado"}, "Evento": "Cena de la Familia Chaleca", "author": "Administrador CSSC"}	\N
918	{"ID": "272", "date": "10/11/2024", "table": "events", "title": {"table": "Evento", "action": "Modelo de Tarjeta Modificado"}, "Evento": "Cena de la Familia Chaleca", "author": "Administrador CSSC"}	\N
919	{"ID": "272", "date": "10/11/2024", "table": "events", "title": {"table": "Evento", "action": "Modelo de Tarjeta Modificado"}, "Evento": "Cena de la Familia Chaleca", "author": "Administrador CSSC"}	\N
920	{"ID": "272", "date": "10/11/2024", "table": "events", "title": {"table": "Evento", "action": "Modelo de Tarjeta Modificado"}, "Evento": "Cena de la Familia Chaleca", "author": "Administrador CSSC"}	\N
921	{"ID": "272", "date": "10/11/2024", "table": "events", "title": {"table": "Evento", "action": "Modelo de Tarjeta Modificado"}, "Evento": "Cena de la Familia Chaleca", "author": "Administrador CSSC"}	\N
922	{"ID": "272", "date": "10/11/2024", "table": "events", "title": {"table": "Evento", "action": "Modelo de Tarjeta Modificado"}, "Evento": "Cena de la Familia Chaleca", "author": "Administrador CSSC"}	\N
923	{"ID": "272", "date": "10/11/2024", "table": "events", "title": {"table": "Evento", "action": "Modelo de Tarjeta Modificado"}, "Evento": "Cena de la Familia Chaleca", "author": "Administrador CSSC"}	\N
924	{"ID": "272", "date": "10/11/2024", "table": "events", "title": {"table": "Evento", "action": "Configuración Adicional Realizada"}, "Evento": "Cena de la Familia Chaleca", "author": "Administrador CSSC"}	\N
925	{"ID": "272", "date": "10/11/2024", "table": "events", "title": {"table": "Evento", "action": "Tarjetas Asignadas al Evento"}, "Evento": "Cena de la Familia Chaleca", "author": "Administrador CSSC"}	\N
926	{"ID": "272", "date": "10/11/2024", "table": "events", "title": {"table": "Evento", "action": "Tarjetas Extra Asignadas y Pagadas"}, "Evento": "Cena de la Familia Chaleca", "author": "Administrador CSSC"}	\N
927	{"ID": "272", "date": "10/11/2024", "table": "events", "title": {"table": "Evento", "action": "Tarjetas Extra Asignadas y Pagadas"}, "Evento": "Cena de la Familia Chaleca", "author": "Administrador CSSC"}	\N
928	{"ID": "272", "date": "11/11/2024", "table": "events", "title": {"table": "Evento", "action": "Tarjetas Extra Asignadas y Pagadas"}, "Evento": "Cena de la Familia Chaleca", "author": "Administrador CSSC"}	\N
929	{"ID": "272", "date": "11/11/2024", "table": "events", "title": {"table": "Evento", "action": "Tarjetas Extra Asignadas y Pagadas"}, "Evento": "Cena de la Familia Chaleca", "author": "Administrador CSSC"}	\N
930	{"ID": "272", "date": "11/11/2024", "table": "events", "title": {"table": "Evento", "action": "Tarjetas Extra Asignadas y Pagadas"}, "Evento": "Cena de la Familia Chaleca", "author": "Administrador CSSC"}	\N
931	{"ID": "272", "date": "11/11/2024", "table": "events", "title": {"table": "Evento", "action": "Tarjetas Extra Asignadas y Pagadas"}, "Evento": "Cena de la Familia Chaleca", "author": "Administrador CSSC"}	\N
932	{"ID": "272", "date": "11/11/2024", "table": "events", "title": {"table": "Evento", "action": "Tarjetas Extra Asignadas y Pagadas"}, "Evento": "Cena de la Familia Chaleca", "author": "Administrador CSSC"}	\N
933	{"ID": "272", "date": "11/11/2024", "table": "events", "title": {"table": "Evento", "action": "Tarjetas Extra Asignadas y Pagadas"}, "Evento": "Cena de la Familia Chaleca", "author": "Administrador CSSC"}	\N
934	{"ID": "272", "date": "11/11/2024", "table": "events", "title": {"table": "Evento", "action": "Tarjetas Extra Asignadas y Pagadas"}, "Evento": "Cena de la Familia Chaleca", "author": "Administrador CSSC"}	\N
935	{"ID": "272", "date": "11/11/2024", "table": "events", "title": {"table": "Evento", "action": "Tarjetas Extra Asignadas y Pagadas"}, "Evento": "Cena de la Familia Chaleca", "author": "Administrador CSSC"}	\N
936	{"ID": "272", "date": "11/11/2024", "table": "events", "title": {"table": "Evento", "action": "Tarjetas Extra Asignadas y Pagadas"}, "Evento": "Cena de la Familia Chaleca", "author": "Administrador CSSC"}	\N
937	{"ID": "272", "date": "11/11/2024", "table": "events", "title": {"table": "Evento", "action": "Tarjetas Extra Asignadas y Pagadas"}, "Evento": "Cena de la Familia Chaleca", "author": "Administrador CSSC"}	\N
938	{"ID": "272", "date": "11/11/2024", "table": "events", "title": {"table": "Evento", "action": "Tarjetas Extra Asignadas y Pagadas"}, "Evento": "Cena de la Familia Chaleca", "author": "Administrador CSSC"}	\N
939	{"ID": "272", "date": "11/11/2024", "table": "events", "title": {"table": "Evento", "action": "Tarjetas Extra Asignadas y Pagadas"}, "Evento": "Cena de la Familia Chaleca", "author": "Administrador CSSC"}	\N
940	{"ID": "272", "date": "11/11/2024", "table": "events", "title": {"table": "Evento", "action": "Tarjetas Extra Asignadas y Pagadas"}, "Evento": "Cena de la Familia Chaleca", "author": "Administrador CSSC"}	\N
941	{"ID": "272", "date": "11/11/2024", "table": "events", "title": {"table": "Evento", "action": "Tarjetas Extra Asignadas y Pagadas"}, "Evento": "Cena de la Familia Chaleca", "author": "Administrador CSSC"}	\N
942	{"ID": "272", "date": "11/11/2024", "table": "events", "title": {"table": "Evento", "action": "Tarjetas Extra Asignadas y Pagadas"}, "Evento": "Cena de la Familia Chaleca", "author": "Administrador CSSC"}	\N
943	{"ID": "272", "date": "11/11/2024", "table": "events", "title": {"table": "Evento", "action": "Tarjetas Extra Asignadas y Pagadas"}, "Evento": "Cena de la Familia Chaleca", "author": "Administrador CSSC"}	\N
944	{"ID": "272", "date": "11/11/2024", "table": "events", "title": {"table": "Evento", "action": "Tarjetas Extra Asignadas y Pagadas"}, "Evento": "Cena de la Familia Chaleca", "author": "Administrador CSSC"}	\N
945	{"ID": "272", "date": "11/11/2024", "table": "events", "title": {"table": "Evento", "action": "Tarjetas Extra Asignadas y Pagadas"}, "Evento": "Cena de la Familia Chaleca", "author": "Administrador CSSC"}	\N
946	{"ID": "272", "date": "11/11/2024", "table": "events", "title": {"table": "Evento", "action": "Tarjetas Extra Asignadas y Pagadas"}, "Evento": "Cena de la Familia Chaleca", "author": "Administrador CSSC"}	\N
947	{"ID": "272", "date": "11/11/2024", "table": "events", "title": {"table": "Evento", "action": "Tarjetas Extra Asignadas y Pagadas"}, "Evento": "Cena de la Familia Chaleca", "author": "Administrador CSSC"}	\N
948	{"ID": "272", "date": "11/11/2024", "table": "events", "title": {"table": "Evento", "action": "Tarjetas Extra Asignadas y Pagadas"}, "Evento": "Cena de la Familia Chaleca", "author": "Administrador CSSC"}	\N
949	{"ID": "272", "date": "11/11/2024", "table": "events", "title": {"table": "Evento", "action": "Tarjetas Extra Asignadas y Pagadas"}, "Evento": "Cena de la Familia Chaleca", "author": "Administrador CSSC"}	\N
950	{"ID": "272", "date": "11/11/2024", "table": "events", "title": {"table": "Evento", "action": "Tarjetas Extra Asignadas y Pagadas"}, "Evento": "Cena de la Familia Chaleca", "author": "Administrador CSSC"}	\N
951	{"ID": "272", "date": "11/11/2024", "table": "events", "title": {"table": "Evento", "action": "Tarjetas Extra Asignadas y Pagadas"}, "Evento": "Cena de la Familia Chaleca", "author": "Administrador CSSC"}	\N
952	{"ID": "272", "date": "11/11/2024", "table": "events", "title": {"table": "Evento", "action": "Tarjetas Extra Asignadas y Pagadas"}, "Evento": "Cena de la Familia Chaleca", "author": "Administrador CSSC"}	\N
953	{"ID": "272", "date": "11/11/2024", "table": "events", "title": {"table": "Evento", "action": "Tarjetas Extra Asignadas y Pagadas"}, "Evento": "Cena de la Familia Chaleca", "author": "Administrador CSSC"}	\N
954	{"ID": "272", "date": "11/11/2024", "table": "events", "title": {"table": "Evento", "action": "Tarjetas Extra Asignadas y Pagadas"}, "Evento": "Cena de la Familia Chaleca", "author": "Administrador CSSC"}	\N
955	{"ID": "272", "date": "11/11/2024", "table": "events", "title": {"table": "Evento", "action": "Tarjetas Extra Asignadas y Pagadas"}, "Evento": "Cena de la Familia Chaleca", "author": "Administrador CSSC"}	\N
956	{"ID": "272", "date": "11/11/2024", "table": "events", "title": {"table": "Evento", "action": "Tarjetas Extra Asignadas y Pagadas"}, "Evento": "Cena de la Familia Chaleca", "author": "Administrador CSSC"}	\N
957	{"ID": "272", "date": "11/11/2024", "table": "events", "title": {"table": "Evento", "action": "Tarjetas Extra Asignadas y Pagadas"}, "Evento": "Cena de la Familia Chaleca", "author": "Administrador CSSC"}	\N
958	{"ID": "272", "date": "11/11/2024", "table": "events", "title": {"table": "Evento", "action": "Tarjetas Extra Asignadas y Pagadas"}, "Evento": "Cena de la Familia Chaleca", "author": "Administrador CSSC"}	\N
959	{"ID": "272", "date": "11/11/2024", "table": "events", "title": {"table": "Evento", "action": "Tarjetas Extra Asignadas y Pagadas"}, "Evento": "Cena de la Familia Chaleca", "author": "Administrador CSSC"}	\N
960	{"ID": "272", "date": "11/11/2024", "table": "events", "title": {"table": "Evento", "action": "Tarjetas Extra Asignadas y Pagadas"}, "Evento": "Cena de la Familia Chaleca", "author": "Administrador CSSC"}	\N
961	{"ID": "272", "date": "11/11/2024", "table": "events", "title": {"table": "Evento", "action": "Tarjetas Extra Asignadas y Pagadas"}, "Evento": "Cena de la Familia Chaleca", "author": "Administrador CSSC"}	\N
962	{"ID": "272", "date": "11/11/2024", "table": "events", "title": {"table": "Evento", "action": "Tarjetas Extra Asignadas y Pagadas"}, "Evento": "Cena de la Familia Chaleca", "author": "Administrador CSSC"}	\N
963	{"ID": "272", "date": "11/11/2024", "table": "events", "title": {"table": "Evento", "action": "Tarjetas Extra Asignadas y Pagadas"}, "Evento": "Cena de la Familia Chaleca", "author": "Administrador CSSC"}	\N
964	{"ID": "272", "date": "11/11/2024", "table": "events", "title": {"table": "Evento", "action": "Tarjetas Extra Asignadas y Pagadas"}, "Evento": "Cena de la Familia Chaleca", "author": "Administrador CSSC"}	\N
965	{"ID": "272", "date": "11/11/2024", "table": "events", "title": {"table": "Evento", "action": "Tarjetas Extra Asignadas y Pagadas"}, "Evento": "Cena de la Familia Chaleca", "author": "Administrador CSSC"}	\N
966	{"ID": "273", "date": "11/11/2024", "table": "events", "title": {"table": "Evento", "action": "Inicializado"}, "Evento": "Fiesta Navideña", "author": "Administrador CSSC"}	\N
967	{"ID": "273", "date": "11/11/2024", "table": "events", "title": {"table": "Evento", "action": "Modelo de Tarjeta Creado"}, "Evento": "Fiesta Navideña", "author": "Administrador CSSC"}	\N
968	{"ID": "273", "date": "11/11/2024", "table": "events", "title": {"table": "Evento", "action": "Configuración Adicional Realizada"}, "Evento": "Fiesta Navideña", "author": "Administrador CSSC"}	\N
969	{"ID": "273", "date": "11/11/2024", "table": "events", "title": {"table": "Evento", "action": "Tarjetas Asignadas al Evento"}, "Evento": "Fiesta Navideña", "author": "Administrador CSSC"}	\N
970	{"ID": "273", "date": "11/11/2024", "table": "events", "title": {"table": "Evento", "action": "Tarjetas Asignadas al Evento"}, "Evento": "Fiesta Navideña", "author": "Administrador CSSC"}	\N
\.


--
-- Data for Name: events; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.events (id, name, status, settings, data) FROM stdin;
273	Fiesta Navideña	Listo	{"model": {"type": "", "payed": false, "card_id": "", "exchanged": false, "family_id": "", "payedDate": "", "complements": "{}", "exchangedDate": ""}, "settings": {"date": "16/11/2024", "price": "15.00", "levels": ["1"], "cardsQtyPerStudent": "1", "forgottenCardPrice": "15.00"}, "complements": {"0": {"id": 0, "price": "3.00", "title": "Película"}, "1": {"id": 1, "price": "3.00", "title": "Galletas"}}}	{"cards": {"456123": {"type": "assignedCard", "payed": false, "card_id": "456123", "exchanged": false, "family_id": "6", "payedDate": "", "complements": "{}", "exchangedDate": ""}, "97845612": {"type": "assignedCard", "payed": false, "card_id": "97845612", "exchanged": false, "family_id": "3", "payedDate": "", "complements": "{}", "exchangedDate": ""}, "789456123": {"type": "assignedCard", "payed": false, "card_id": "789456123", "exchanged": false, "family_id": "41", "payedDate": "", "complements": "{}", "exchangedDate": ""}, "7894561238": {"type": "assignedCard", "payed": false, "card_id": "7894561238", "exchanged": false, "family_id": "27", "payedDate": "", "complements": "{}", "exchangedDate": ""}, "/78945612309": {"type": "assignedCard", "payed": false, "card_id": "/78945612309", "exchanged": false, "family_id": "5", "payedDate": "", "complements": "{}", "exchangedDate": ""}}}
272	Cena de la Familia Chaleca	Listo	{"model": {"type": "", "payed": false, "card_id": "", "exchanged": false, "family_id": "", "payedDate": "", "complements": {"0": {"id": "0", "exchanged": false, "exchangedDate": ""}}, "exchangedDate": ""}, "settings": {"date": "16/11/2024", "price": "15.00", "levels": ["1"], "cardsQtyPerStudent": "1", "forgottenCardPrice": "15.00"}, "complements": {"0": {"id": 0, "price": "8.00", "title": "Cena"}, "1": {"id": 1, "price": "0.75", "title": "Soda"}}}	{"cards": {"7845": {"type": "extraCard", "payed": false, "card_id": "7845", "exchanged": false, "family_id": 16, "payedDate": "", "complements": {"0": {"id": "0", "exchanged": false, "exchangedDate": ""}, "1": {"id": "1", "exchanged": false, "exchangedDate": ""}}, "exchangedDate": ""}, "94561": {"type": "assignedCard", "payed": false, "card_id": "94561", "exchanged": false, "family_id": "41", "payedDate": "", "complements": {"0": {"id": "0", "exchanged": false, "exchangedDate": ""}}, "exchangedDate": ""}, "546151": {"type": "extraCard", "payed": "true", "card_id": "546151", "exchanged": false, "family_id": "Miguel González", "payedDate": "11/11/2024 a las 06:24 ", "complements": {"0": {"id": "0", "exchanged": false, "exchangedDate": ""}, "1": {"id": "1", "exchanged": false, "exchangedDate": ""}}, "exchangedDate": ""}, "789456": {"type": "extraCard", "payed": false, "card_id": "789456", "exchanged": false, "family_id": 16, "payedDate": "", "complements": {"0": {"id": "0", "exchanged": false, "exchangedDate": ""}, "1": {"id": "1", "exchanged": false, "exchangedDate": ""}}, "exchangedDate": ""}, "849561": {"type": "extraCard", "payed": false, "card_id": "849561", "exchanged": false, "family_id": "Miguel González", "payedDate": "", "complements": {"0": {"id": "0", "exchanged": false, "exchangedDate": ""}, "1": {"id": "1", "exchanged": false, "exchangedDate": ""}}, "exchangedDate": ""}, "894561": {"type": "assignedCard", "payed": false, "card_id": "894561", "exchanged": false, "family_id": "27", "payedDate": "", "complements": {"0": {"id": "0", "exchanged": false, "exchangedDate": ""}}, "exchangedDate": ""}, "984561": {"type": "assignedCard", "payed": false, "card_id": "984561", "exchanged": false, "family_id": "3", "payedDate": "", "complements": {"0": {"id": "0", "exchanged": false, "exchangedDate": ""}}, "exchangedDate": ""}, "8945618": {"type": "assignedCard", "payed": false, "card_id": "8945618", "exchanged": false, "family_id": "5", "payedDate": "", "complements": {"0": {"id": "0", "exchanged": false, "exchangedDate": ""}}, "exchangedDate": ""}, "9784651": {"type": "extraCard", "payed": true, "card_id": "9784651", "exchanged": false, "family_id": "León Barrera", "payedDate": "11/11/2024, 08:45 a. m.", "complements": {"0": {"id": "0", "exchanged": false, "exchangedDate": ""}, "1": {"id": "1", "exchanged": false, "exchangedDate": ""}}, "exchangedDate": ""}, "9845614": {"type": "assignedCard", "payed": false, "card_id": "9845614", "exchanged": false, "family_id": "6", "payedDate": "", "complements": {"0": {"id": "0", "exchanged": false, "exchangedDate": ""}}, "exchangedDate": ""}, "9846512": {"type": "extraCard", "payed": true, "card_id": "9846512", "exchanged": false, "family_id": 16, "payedDate": "11/11/2024, 09:15 a. m.", "complements": {"0": {"id": "0", "exchanged": false, "exchangedDate": ""}, "1": {"id": "1", "exchanged": false, "exchangedDate": ""}}, "exchangedDate": ""}, "78945612": {"type": "extraCard", "payed": true, "card_id": "78945612", "exchanged": false, "family_id": 16, "payedDate": "11/11/2024, 09:15 a. m.", "complements": {"0": {"id": "0", "exchanged": false, "exchangedDate": ""}, "1": {"id": "1", "exchanged": false, "exchangedDate": ""}}, "exchangedDate": ""}, "78946512": {"type": "extraCard", "payed": true, "card_id": "78946512", "exchanged": false, "family_id": "León Barrera", "payedDate": "11/11/2024, 08:45 a. m.", "complements": {"0": {"id": "0", "exchanged": false, "exchangedDate": ""}, "1": {"id": "1", "exchanged": false, "exchangedDate": ""}}, "exchangedDate": ""}, "89456123": {"type": "extraCard", "payed": true, "card_id": "89456123", "exchanged": false, "family_id": 16, "payedDate": "11/11/2024, 08:13 a. m.", "complements": {"0": {"id": "0", "exchanged": false, "exchangedDate": ""}, "1": {"id": "1", "exchanged": false, "exchangedDate": ""}}, "exchangedDate": ""}, "894561235": {"type": "extraCard", "payed": true, "card_id": "894561235", "exchanged": false, "family_id": 16, "payedDate": "11/11/2024, 08:13 a. m.", "complements": {"0": {"id": "0", "exchanged": false, "exchangedDate": ""}, "1": {"id": "1", "exchanged": false, "exchangedDate": ""}}, "exchangedDate": ""}, "8946518465": {"type": "extraCard", "payed": true, "card_id": "8946518465", "exchanged": false, "family_id": "León Barrera", "payedDate": "11/11/2024, 09:02 a. m.", "complements": {"0": {"id": "0", "exchanged": false, "exchangedDate": ""}, "1": {"id": "1", "exchanged": false, "exchangedDate": ""}}, "exchangedDate": ""}, "89465189465": {"type": "extraCard", "payed": true, "card_id": "89465189465", "exchanged": false, "family_id": "León Barrera", "payedDate": "11/11/2024, 09:02 a. m.", "complements": {"0": {"id": "0", "exchanged": false, "exchangedDate": ""}, "1": {"id": "1", "exchanged": false, "exchangedDate": ""}}, "exchangedDate": ""}, "98465198465": {"type": "extraCard", "payed": true, "card_id": "98465198465", "exchanged": false, "family_id": "León Barrera", "payedDate": "11/11/2024, 09:15 a. m.", "complements": {"0": {"id": "0", "exchanged": false, "exchangedDate": ""}, "1": {"id": "1", "exchanged": false, "exchangedDate": ""}}, "exchangedDate": ""}, "789465198465": {"type": "extraCard", "payed": true, "card_id": "789465198465", "exchanged": false, "family_id": "León Barrera", "payedDate": "11/11/2024, 09:15 a. m.", "complements": {"0": {"id": "0", "exchanged": false, "exchangedDate": ""}, "1": {"id": "1", "exchanged": false, "exchangedDate": ""}}, "exchangedDate": ""}, "894651398465": {"type": "extraCard", "payed": true, "card_id": "894651398465", "exchanged": false, "family_id": "León Barrera", "payedDate": "11/11/2024, 09:06 a. m.", "complements": {"0": {"id": "0", "exchanged": false, "exchangedDate": ""}, "1": {"id": "1", "exchanged": false, "exchangedDate": ""}}, "exchangedDate": ""}, "8945619784651": {"type": "extraCard", "payed": true, "card_id": "8945619784651", "exchanged": false, "family_id": "León Barrera", "payedDate": "11/11/2024, 09:05 a. m.", "complements": {"0": {"id": "0", "exchanged": false, "exchangedDate": ""}, "1": {"id": "1", "exchanged": false, "exchangedDate": ""}}, "exchangedDate": ""}}, "payment": {"00000001": {"date": "11/11/2024 a las 06:24 ", "total": "23.75", "client": "Miguel González", "cashier": "Administrador CSSC", "paymentId": "00000001", "description": "Pago de Tarjeta #546151"}, "00000002": {"date": "11/11/2024 a las 08:13 ", "total": "47.5", "client": "Miguel Orlando Ledezma Arévalo", "cashier": "Administrador CSSC", "paymentId": "00000002", "description": "Pago de 2 Tarjeta/s"}, "00000003": {"date": "11/11/2024 a las 09:01 ", "total": "47.50", "client": "León Barrera", "cashier": "Administrador CSSC", "paymentId": "00000003", "description": "Pago de 2 Tarjeta/s"}, "00000004": {"date": "11/11/2024 a las 09:05 ", "total": "47.50", "client": "León Barrera", "cashier": "Administrador CSSC", "paymentId": "00000004", "description": "Pago de 2 Tarjeta/s"}, "00000005": {"date": "11/11/2024 a las 09:06 ", "total": "47.50", "client": "León Barrera", "cashier": "Administrador CSSC", "paymentId": "00000005", "description": "Pago de 2 Tarjeta/s"}, "00000006": {"date": "11/11/2024 a las 09:15 ", "total": "47.50", "client": "León Barrera", "cashier": "Administrador CSSC", "paymentId": "00000006", "description": "Pago de 2 Tarjeta/s"}, "00000007": {"date": "11/11/2024 a las 09:15 ", "total": "47.50", "client": "Miguel Orlando Ledezma Arévalo", "cashier": "Administrador CSSC", "paymentId": "00000007", "description": "Pago de 2 Tarjeta/s"}}}
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
42	{"Carlos Luís","Menjivar Peraza"}	20210054	{15,1}	Habilitado
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, name, pass, mail, rol_id, picture, status) FROM stdin;
4	{Administrador,CSSC}	$2y$10$OTTzfkJ6LIdbPsIu/VndE.Ihj18YF59y22Xw0E2eZ6sT0JbfRgTsO	Administrador@santacecilia.edu.sv	1	temp_img.png	Habilitado
43	{"Emmanuel Enrique",Posada}	$2y$10$feQeRkavHJevCvr722cMU.IpjGquGPhNXa873QqzvxkfILMLWmMRC	emmanuel.posada@santacecilia.edu.sv	5	Emmanuel Enrique_Posada_3709.png	Habilitado
40	{"Luis Raúl","Torres Hernández"}	$2y$10$apGR32iV2BHnJ0TSVX4Iw.RtpGIlJIIbErddFQv79t8ObRvkHf4S.	luis.torres@santacecilia.edu.sv	4	Luis Raúl_Torres Hernández_5295.png	Habilitado
44	{Felix,Masín}	$2y$10$MZhHjvIfHZuhUNEG5yhYduiy14GgmLYL5nIimAN004bTva8htBacG	felix.masin@santacecilia.edu.sv	3	Felix_Masín_6218.png	Habilitado
26	{"Miguel Orlando ","Ledezma Arévalo"}	$2y$10$Py3Vmq7YXV0/Bs.QNcldkedscL0wo8yDLUcDmeZMJhorgRL6tc1KW	20110019@santacecilia.edu.sv	106	Miguel Orlando _Ledezma Arévalo_9680.png	Habilitado
45	{Eunice,Castro}	$2y$10$nZhWKMYMFMkt2Wg.C4jTP.XXcYtDAHZN.zf1AUg1R.9bJYog.Ail6	eunice.castro@santacecilia.edu.sv	2	Eunice_Castro_3441.png	Habilitado
\.


--
-- Name: cards_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.cards_id_seq', 1, false);


--
-- Name: control_log_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.control_log_id_seq', 970, true);


--
-- Name: events_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.events_id_seq', 273, true);


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

SELECT pg_catalog.setval('public.students_id_seq', 42, true);


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

