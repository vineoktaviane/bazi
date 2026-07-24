# BaZi Companion

A small hobby app for exploring BaZi (Chinese Four Pillars) and Zi Wei Dou Shu.

I started this out of personal interest in Chinese metaphysics and wanted a
tidy way to look at my own chart without pasting my birth details into random
websites. Everything is worked out on your device from the birth date, time,
and place, and nothing gets sent anywhere.

It runs on the web, iOS, and Android from one Expo/React Native codebase.

## Running it

```
npm install
npm run web       # open in a browser
npm run android   # Android (Expo Go or a dev build)
npm run ios       # iOS (needs macOS, or Expo Go on a device)
npm test          # runs the calculation checks
```

## Notes

The chart calculations follow common conventions. For example, births from
11pm count as the next day, and clock time is used as entered without
solar-time correction. Where a tradition has more than one method, I picked
one and noted it in the app.

This is for reflection and curiosity, not prediction or advice. It is a
personal project, so expect rough edges.
