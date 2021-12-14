### March 23rd, 2021
#### By Yerin Adler (03:00 PM)
- Separate `author` read model from `book` read model (Facade)
- Introduce `projection` directory to store projection related files

### March 23rd, 2021
#### By Yerin Adler (09:00 AM)
- Add inter-boundaries model communication
Note: `Author` model is embedded within the `Book` context

### November 3rd, 2021
#### By Chatthana Janethanakarn
- Change message bus implementation from `EventEmitter` to `Redis Pub/Sub`
### November 20th, 2021
#### By Yerin Adler
- Revise event handling mechanism
- Revise dependency registration in `entrypoint.ts`
- Change `entrypoint.ts` to `startup.ts`

