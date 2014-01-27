# AWK Script to parse the MCC-MNC table obtained from: http://www.itu.int/pub/T-SP-E.212B-2013
# -> You should export the table to CSV (with tabs) file with LibreOffice ;)
# (c) Telefonica Digital, 2013 - All rights reserved
# Fernando Rodríguez Sela <frsela at tid dot es>

# Use: awk -f load_mcc_mnc_onredis.awk mcc_mnc_list.csv

function redis(cmd, showresult) {
  if(execute_redis == 1) {
    if(showresult == 1) {
      command = "redis-cli " cmd
    } else {
      command = "redis-cli " cmd " > /dev/null 2> /dev/null"
    }
    debug("[REDIS] " command)
    system(command)
  } else {
    printf("%s\n", cmd)
  }
}

function debug(msg) {
  if(debug_enabled == 1) {
    printf(" * %s\n", msg)
  }
}

BEGIN {
  debug_enabled = 0
  execute_redis = 1   # Execute redis command or only print into screen

  printf("MCC & MNC import tool for the Telefonica Digital wakeup platform\n")
  printf("(c) Telefonica Digital, 2013 - All rights reserved\n\n")
  FS = "\t"
  redis("del operators")
  complete_line = 0
  operators_count = 0
}

{
  # Skip first line (header)
  if(NR <= 1) {
    debug("Skipping line " NR)
    next
  }

  if($1 != "") {
    country = $1
    sub("'", "\\'", country)
  }
  if($2 != "") {
    operator = $2
    sub("'", "\\'", operator)
    mccmnc = $3
    sub(" ", "-", mccmnc)
    complete_line = 1
  }

  if(complete_line == 1) {
    sub("'", "`", operator);
    sub("'", "`", country);
    redis("hset operators '" mccmnc "' '{ \"country\": \"" country "\", \"operator\": \"" operator "\", \"mccmnc\": \"" mccmnc "\" }'")
    complete_line = 0
    operators_count++
    if(debug_enabled == 0 && execute_redis == 1) {
      printf(".");
    }
  }
}

END {
  printf("\n\nProcessed %d lines and %d operators\n", NR, operators_count)
  if(execute_redis == 1) {
    printf("Rows inserted: ")
    redis("hlen operators", 1)
  }
  printf("\n\nFinished.\n");
}
