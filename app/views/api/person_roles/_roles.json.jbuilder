# Locals: roles

json.array! roles.collect { |r| { value: r, display: t(r) } }