require 'time'
require 'json'
require 'mysql2-cs-bind'

client = Mysql2::Client.new(:host => "localhost", :username => "root", :password => "root", :database => "zabbix")

sql = <<-SQL
  SELECT history.itemid, FROM_UNIXTIME(history.clock) as clock, history.value, history.ns, items.name
    FROM history_uint AS history
    JOIN items ON
             history.itemid = items.itemid
   WHERE items.name LIKE '%Association%'
     AND history.clock BETWEEN
             UNIX_TIMESTAMP(?)
         AND UNIX_TIMESTAMP(?)
SQL

day0_from = '2015-08-20 17:00:00'
day0_to = '2015-08-20 21:30:00'
day1_from = '2015-08-21 08:00:00'
day1_to = '2015-08-21 18:30:00'
day2_from = '2015-08-22 08:00:00'
day2_to = '2015-08-22 19:00:00'


items = client.xquery(sql + "UNION ALL" + sql + "UNION ALL" + sql + "ORDER BY clock", day0_from, day0_to, day1_from, day1_to, day2_from, day2_to)

timeline = {}
checkpoints = []
interval = 300 # (sec)

checkpoint = Time.parse(day0_from)
items.each do |item|
  while checkpoint < item['clock'] do
    checkpoint = checkpoint + interval
  end

  item['name'] =~ /(AP-[0-9]{3}).+((2\.4|5)GHz)/
  ap = $1
  band = $2.sub('.', '_')

  next if timeline.has_key?(checkpoint) && timeline[checkpoint].has_key?(ap) && timeline[checkpoint][ap].has_key?(band)

  checkpoints << checkpoint unless timeline.has_key? checkpoint
  timeline[checkpoint] = {} unless timeline.has_key? checkpoint
  timeline[checkpoint][ap] = {} unless timeline[checkpoint].has_key? ap
  timeline[checkpoint][ap][band] = {:associations => item['value'].to_i}
end

# timeline = {
#     :checkpoint => {
#         :ap => {
#             :band => {
#                 :associations => int
#             }
#         }
#     }
# }

# merge 2.4 GHz and 5 GHz
merged_timeline = {}
timeline.each do |time, aps|
  merged_timeline[time] = {}
  aps.each do |ap, associations|
    merged_associations = 0
    associations.each do |band, value|
      merged_associations = merged_associations + value[:associations]
    end
    merged_timeline[time][ap] = {:associations => merged_associations}
  end
end

File.open("associations.json","w") do |f|
  f.write(merged_timeline.to_json)
end
File.open("checkpoints.json","w") do |f|
  f.write(checkpoints.to_json)
end
