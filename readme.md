# Vanishing Vault 🔐

A secure backend service for storing and retrieving temporary encryption keys with automatic expiration.

## Overview

Vanishing Vault provides a simple API for storing encryption keys that automatically become inaccessible after a specified expiry time. This is useful for implementing secure, time-limited access to encrypted data.

## Features

- Store encryption keys with expiration timestamps
- Retrieve keys before expiry
- Automatic key invalidation after expiry
- RESTful API endpoints
- Built with Express.js and Supabase

