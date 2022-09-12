# queueを指定
PRE_INT_QUEUE=re6int
PRE_BAT_QUEUE=re6bat
INT_QUEUE=re7int
BAT_QUEUE=re7bat

# 置換したいファイルを指定
file_lists=( \
  derate_opt.sh \
  latency_opt.sh \
)

# == 以降で置換 (変更不要) ====
for file in ${file_lists[@]}
do
  sed -i -e s/$PRE_INT_QUEUE/$INT_QUEUE/g $file
done

for file in ${file_lists[@]}
do
  sed -i -e s/$PRE_BAT_QUEUE/$BAT_QUEUE/g $file
done
