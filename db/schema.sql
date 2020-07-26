-- Table: public.projects

-- DROP TABLE public.projects;

CREATE TABLE public.projects
(
    id integer NOT NULL DEFAULT nextval('products_id_seq'::regclass),
    name text COLLATE pg_catalog."default",
    status_progress text COLLATE pg_catalog."default",
    status_provider text COLLATE pg_catalog."default",
    complicity integer NOT NULL,
    owner_id integer,
    resources integer,
    price integer,
    provider text COLLATE pg_catalog."default",
    start_date date,
    end_date date,
    offers numeric,
    CONSTRAINT products_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE public.projects
    OWNER to postgres;
