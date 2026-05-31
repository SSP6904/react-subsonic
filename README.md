# React Subsonic
A simple React-based website that downloads music from your subsonic server! :musical_note:

## Requirements
In order to build or run the website on your machine, you need to have the following applications installed.

- NodeJS (latest version works fine)

Because this website focuses entirely on the Subsonic API, you will also need to have a hosted and working subsonic instance that you are able to connect with and authenticate using a username and password, along with a working user account that you've created beforehand.

Additionally, you have to make sure that you're instance has an **HTTPS feature enabled** in order to make it work with the fetch API. If you don't have HTTPS enabled on your instance, **your request's won't work with the script** due to a content mixing error, and the data that you get from the API will **fail to display correctly.**

## How it works

> [!NOTE]
>
> This section is incomplete currently! Check back later once there's a change to it!

## Resources
To learn more about the Subsonic REST API and how you can use it for yourself, have a look at the following links below!

- [Subsonic API Documentation]
- [Subsonic Website]
- [Subsonic REST routes]

[Subsonic API Documentation]: https://www.subsonic.org/pages/api.jsp
[Subsonic Website]: https://www.subsonic.org/
[Subsonic REST routes]: https://www.subsonic.org/pages/inc/api/schema/subsonic-rest-api-1.12.0.xsd