import { NextResponse } from 'next/server';

export function proxy(req) {
    if (process.env.MAINTENANCE_MODE === 'true') {
        return new NextResponse(
            `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Error</title>
        <style>
          body {
            margin: 0;
            height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            background: #f5f5f5;
            font-family: Arial, sans-serif;
          }

          .card {
            background: white;
            padding: 40px;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            text-align: center;
            width: 300px;
          }

          .card h1 {
            color: #e74c3c;
            margin-bottom: 10px;
          }

          .card p {
            color: #555;
            font-size: 14px;
          }
        </style>
      </head>

      <body>
        <div class="card">
          <h1>500 Error</h1>
          <p>Internal Server Error</p>
        </div>
      </body>
      </html>
      `,
            {
                status: 500,
                headers: {
                    'content-type': 'text/html',
                },
            }
        );
    }

    return NextResponse.next();
}

export const config = {
    matcher: '/:path*',
};
