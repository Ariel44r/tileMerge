select *, count(*) from pathTiles group by file_name, level_zoom, dir_1 having count(*) > 1;
update pathTiles set repeat_flag=1 where (file_name='112' and level_zoom='8' and dir_1='56') or (file_name='113' and level_zoom='8' and dir_1='56');
select * from pathTiles where repeat_flag=1;
update pathTiles set repeat_flag=0 where repeat_flag=1;