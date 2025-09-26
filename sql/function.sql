create or replace function increment_like(tid uuid)
returns void as $$
begin
  update templates set like_count = like_count + 1 where id = tid;
end;
$$ language plpgsql;

create or replace function decrement_like(tid uuid)
returns void as $$
begin
  update templates set like_count = greatest(like_count - 1, 0) where id = tid;
end;
$$ language plpgsql;
