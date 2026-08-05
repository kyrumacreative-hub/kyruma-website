-- Native sequences allocate atomically and deliberately do not roll back, so a
-- code value can never be reused after a failed conversion attempt.
CREATE SEQUENCE "PartnerCodeSequence_value_seq" START WITH 1 INCREMENT BY 1 MINVALUE 1 NO CYCLE;
