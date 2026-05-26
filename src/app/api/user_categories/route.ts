import { NextResponse } from "next/server";
import pool from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { sendEmail } from "@/components/email/helpers/sendVerificationEmail";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const { category_id } = await req.json();
  const userId = session.user.id;

  await pool.query(
    `
    INSERT INTO user_categories (user_id, category_id)
    VALUES ($1, $2)
    ON CONFLICT DO NOTHING
    `,
    [userId, category_id]
  ); 

   await sendEmail({
    type:"welcome",
    email:"pratikguragain@gmail.com",
    username:"Pratik guragain"
  })

//   const { rows:completionProfile } = await pool.query(`
//     SELECT 
//       u.email,
//       up.display_name,
//       u.profile_completion,
//       c.about AS company_about,
//       (SELECT COUNT(*) > 0 FROM user_profile_services  WHERE user_id = u.user_id) AS has_services,
//       (SELECT COUNT(*) > 0 FROM user_profile_photos    WHERE user_id = u.user_id) AS has_photos,
//       (SELECT COUNT(*) > 0 FROM user_social_links      WHERE user_id = u.user_id AND is_visible = true) AS has_social,
//       (SELECT COUNT(*) > 0 FROM user_accreditations    WHERE user_id = u.user_id) AS has_accreditations,
//       (SELECT COUNT(*) > 0 FROM user_faqs              WHERE user_id = u.user_id AND is_visible = true) AS has_faqs
//     FROM users u
//     LEFT JOIN user_profiles up ON up.user_id = u.user_id
//     LEFT JOIN company c ON c.user_id = u.user_id
//     WHERE u.profile_completion < 100
//       AND u.is_email_verified = true
//       AND u.created_at < NOW() - INTERVAL '24 hours'
//   `);
//   const providerProfile = completionProfile[0];

// if (providerProfile) {
//   await sendEmail({
//     type: "complete-profile",
//     email: "pratikguragain4@outlook.com",
//     username: providerProfile.display_name,
//     completionPercent: providerProfile.profile_completion,
//     profileFlags: {
//       hasAboutAndBio:
//         providerProfile.display_name?.trim().length > 0 &&
//         providerProfile.company_about?.trim().length >= 30,

//       hasServices: providerProfile.has_services,
//       hasPhotos: providerProfile.has_photos,
//       hasSocialLinks: providerProfile.has_social,
//       hasAccreditations: providerProfile.has_accreditations,
//       hasFaqs: providerProfile.has_faqs,
//     },
//   });
// }

  return NextResponse.json({ success: true });
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const { category_id } = await req.json();
  const userId = session.user.id;

  await pool.query(
    `
    DELETE FROM user_categories
    WHERE user_id = $1 AND category_id = $2
    `,
    [userId, category_id]
  );

  return NextResponse.json({ success: true });
}
