if redis.call('exists', KEYS[1]) == 0 then
    return redis.call('setex', KEY[1], ARGV[1], ARGV[2])
end
