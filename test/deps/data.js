module.exports = {
    "thing": "i am thing",
    
    "objectthing": {
        "foo": "inside objectthing, foo i be",
        "bar": "inside objectthing, bar i be"
    },
    
    "things": [
        "thing 1",
        "thing 2",
        "thing 3"
    ],
    
    "promise": Promise.resolve("peekaboo"),
    "callback": cb => cb("peekaboo")
}