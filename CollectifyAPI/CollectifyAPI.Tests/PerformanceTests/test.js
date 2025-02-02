import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
    vus: 100,
    duration: '30s',
    insecureSkipTLSVerify: true,
};

const headers = {
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiJiMGZlZjA4OC1iMTFlLTRjYjYtYjllOS02YmJiN2Q1ZmFhYjIiLCJlbWFpbCI6Im1hcmlhQG1lZGVlYWEuY29tIiwicm9sZSI6InVzZXIiLCJuYmYiOjE3Mzg0MzcwMjgsImV4cCI6MTczODQ0MDYyOCwiaWF0IjoxNzM4NDM3MDI4LCJpc3MiOiJDb2xsZWN0aWZ5QXBwX0lTXzIwMjQiLCJhdWQiOiJDb2xsZWN0aWZ5QXBwX0lTXzIwMjQifQ.vZEhTwwklzBT3uEBg0zIBLuQJVA39jn-_yjFZj6oXuc',
};

export default function () {
    let res = http.get('https://localhost:7073/api/notes/owned_notes', { headers });
    check(res, {
        'is status 200': (r) => r.status === 200,
    });
    sleep(1);
}
