# アソシエーション数取得 SQL
※ Zabbix のデータを保持している MySQL から取得

```sql
  SELECT history.itemid, FROM_UNIXTIME(history.clock) as clock, history.value, history.ns, items.name
    FROM history_uint AS history
    JOIN items ON
             history.itemid = items.itemid
   WHERE items.name LIKE '%Association%'
     AND history.clock BETWEEN
             UNIX_TIMESTAMP('2015-08-20 00:00:00')
         AND UNIX_TIMESTAMP('2015-08-22 09:00:00')
ORDER BY history.clock
```

# アソシエーション数 JSON ファイル作成
```
$ cd /vagrant/app
$ bundle install
$ bundle exec ruby dump_associations.rb
```
