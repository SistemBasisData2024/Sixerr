--
-- PostgreSQL database dump
--

-- Dumped from database version 16.3
-- Dumped by pg_dump version 16.2

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: accounts; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.accounts (
    user_id uuid DEFAULT gen_random_uuid() NOT NULL,
    username text NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    seller_id text,
    profile_img text
);


ALTER TABLE public.accounts OWNER TO admin;

--
-- Name: payments; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.payments (
    payment_id integer NOT NULL,
    buyer_id uuid NOT NULL,
    seller_id uuid NOT NULL,
    payment_time date DEFAULT now(),
    order_details text,
    done boolean DEFAULT false
);


ALTER TABLE public.payments OWNER TO admin;

--
-- Name: payments_payment_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.payments_payment_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.payments_payment_id_seq OWNER TO admin;

--
-- Name: payments_payment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.payments_payment_id_seq OWNED BY public.payments.payment_id;


--
-- Name: reviews; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.reviews (
    review_id integer NOT NULL,
    buyer_id uuid NOT NULL,
    seller_id uuid NOT NULL,
    review text,
    rating integer NOT NULL
);


ALTER TABLE public.reviews OWNER TO admin;

--
-- Name: reviews_review_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.reviews_review_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.reviews_review_id_seq OWNER TO admin;

--
-- Name: reviews_review_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.reviews_review_id_seq OWNED BY public.reviews.review_id;


--
-- Name: sellers; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.sellers (
    seller_id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    seller_name text NOT NULL,
    seller_price integer NOT NULL,
    seller_img_id text,
    portfolio_id text,
    location text,
    rating_total double precision DEFAULT 0,
    rating_count integer DEFAULT 0,
    rating_all integer DEFAULT 0,
    earnings integer DEFAULT 0
);


ALTER TABLE public.sellers OWNER TO admin;

--
-- Name: payments payment_id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.payments ALTER COLUMN payment_id SET DEFAULT nextval('public.payments_payment_id_seq'::regclass);


--
-- Name: reviews review_id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.reviews ALTER COLUMN review_id SET DEFAULT nextval('public.reviews_review_id_seq'::regclass);


--
-- Data for Name: accounts; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.accounts (user_id, username, email, password, seller_id, profile_img) FROM stdin;
d2d8264b-8252-46dd-9acb-3d61b2c49cfc	testing	testing@gmail.com	7f2ababa423061c509f4923dd04b6cf1		1Ae6D886VWlGbNJqYznHOaOyI5NqXfvdZ
6782046d-90b9-4dad-a05a-7dd6adfa6ac2	Fairuz	fairuz@example.com	dc647eb65e6711e155375218212b3964		1PGBK18i_2ldBQ4W_NHGcWj1veZedPohq
3e4a9124-053f-4137-9e80-bb1a1a09be43	test	test@gmail.com	098f6bcd4621d373cade4e832627b4f6		
adf5e01c-6710-4096-8851-cc45c1cc803e	Fairuz 	fairuz2@example.com	696d29e0940a4957748fe3fc9efd22a3		1PMRn1zRa1ioeolwNB57evvT-Ow5bM6aE
18938159-e9e9-4319-afbb-0465af05ed3d	rafliho	rafli@example.com	1b770e75135a02deaaa73efca940200b		1lt4GHsmzmh32ZfhGtqxSRF93Vzw_ZXwY
05b34de0-28de-4cb3-8049-3da820cb5ac2	Man	man@example.com	d1e6b917e2b99d7e4a94d0390b84e304		1rNkzdzARIQ6hYHa9uhDxSSTX-picOOaI
afc2838c-74f7-4bcf-a1d2-a0281fce7bb8	Anthony Davis	anthony@example.com	1c4637c65b65c8129e285a2514bb7a94		1CIFCaxPT3NJ8MdMbgTAVkvY_qKrvdTTt
2106f9f2-7769-4812-a6f4-3e1e807c6527	raflitest	rafli@test.com	369b24bab2a20157b3e56e6d9a610d9f	918d3a9e-23e6-45cb-9c52-a340afd5203b	1e639Io76uNDkzWR3ZlPeYBdtYzIiqgKQ
0c0c0b97-e9e0-4154-a2d0-0eed246284f1	Guy	guy@example.com	c2459ca6f2b3fb9a85d72d55b618dff5	1a5ffee2-0d94-45d6-83d0-a5429919f454	1TVHjcVOxzIckFStxqoJHZGkS_6xlxH9D
4375a3c1-2941-41a5-9fa5-4ccddddf3dfc	george.wiliam	george.wiliam@ui.ac.id	9b306ab04ef5e25f9fb89c998a6aedab	62b3d0c1-b017-4a45-8520-a39803cd7339	1ig78_yvyZlQ4w8m2xnpjGUHEvazQGF1i
\.


--
-- Data for Name: payments; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.payments (payment_id, buyer_id, seller_id, payment_time, order_details, done) FROM stdin;
2	d2d8264b-8252-46dd-9acb-3d61b2c49cfc	d2d8264b-8252-46dd-9acb-3d61b2c49cfc	2024-06-07	\N	t
4	afc2838c-74f7-4bcf-a1d2-a0281fce7bb8	1a5ffee2-0d94-45d6-83d0-a5429919f454	2024-06-09	Please make a JBus app for me	t
5	05b34de0-28de-4cb3-8049-3da820cb5ac2	1a5ffee2-0d94-45d6-83d0-a5429919f454	2024-06-09	JBus app letsgoo	t
\.


--
-- Data for Name: reviews; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.reviews (review_id, buyer_id, seller_id, review, rating) FROM stdin;
17	0c0c0b97-e9e0-4154-a2d0-0eed246284f1	918d3a9e-23e6-45cb-9c52-a340afd5203b	Nice	5
19	0c0c0b97-e9e0-4154-a2d0-0eed246284f1	1a5ffee2-0d94-45d6-83d0-a5429919f454	Reviewing Myself	5
20	0c0c0b97-e9e0-4154-a2d0-0eed246284f1	1a5ffee2-0d94-45d6-83d0-a5429919f454	Halo	3
21	2106f9f2-7769-4812-a6f4-3e1e807c6527	918d3a9e-23e6-45cb-9c52-a340afd5203b	keren	5
22	0c0c0b97-e9e0-4154-a2d0-0eed246284f1	918d3a9e-23e6-45cb-9c52-a340afd5203b	Cancelled order, the seller is bad :c	1
\.


--
-- Data for Name: sellers; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.sellers (seller_id, user_id, seller_name, seller_price, seller_img_id, portfolio_id, location, rating_total, rating_count, rating_all, earnings) FROM stdin;
918d3a9e-23e6-45cb-9c52-a340afd5203b	2106f9f2-7769-4812-a6f4-3e1e807c6527	gambler	100	15XOUYpPAHs57UKrfexxqfHHYm_kIFomc	1gArIheIh5skrgHVIzRUlmsvYW_M1pD8l	Jakarta	3	3	11	100
62b3d0c1-b017-4a45-8520-a39803cd7339	4375a3c1-2941-41a5-9fa5-4ccddddf3dfc	test	123				0	0	0	0
1a5ffee2-0d94-45d6-83d0-a5429919f454	0c0c0b97-e9e0-4154-a2d0-0eed246284f1	JBus	200	1R__Abp_dnMoTkJYKXiCBZPBzYxsk1Zat	1PIT4StzcLsajiA1OWTI8xihxN7EN6hmA	DTE UI, Depok	4	2	8	400
\.


--
-- Name: payments_payment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.payments_payment_id_seq', 8, true);


--
-- Name: reviews_review_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.reviews_review_id_seq', 22, true);


--
-- Name: accounts accounts_email_key; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.accounts
    ADD CONSTRAINT accounts_email_key UNIQUE (email);


--
-- Name: accounts accounts_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.accounts
    ADD CONSTRAINT accounts_pkey PRIMARY KEY (user_id);


--
-- Name: accounts accounts_username_key; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.accounts
    ADD CONSTRAINT accounts_username_key UNIQUE (username);


--
-- Name: sellers sellers_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.sellers
    ADD CONSTRAINT sellers_pkey PRIMARY KEY (seller_id);


--
-- Name: sellers sellers_seller_name_key; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.sellers
    ADD CONSTRAINT sellers_seller_name_key UNIQUE (seller_name);


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO neon_superuser WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON TABLES TO neon_superuser WITH GRANT OPTION;


--
-- PostgreSQL database dump complete
--

