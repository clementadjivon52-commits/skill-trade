import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getUserProfile } from "@/lib/site-data";

type ProfilePageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { id } = await params;
  const user = await getUserProfile(id);

  if (!user) {
    notFound();
  }

  return (
    <div className="page-shell space-y-8 py-10 md:py-14">
      <section className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="glass-card card-hover overflow-hidden rounded-[2rem]">
          <div className="relative h-full min-h-[460px]">
            <Image
              src={user.photo}
              alt={user.name}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6">
              <div className="rounded-[1.6rem] border border-white/10 bg-slate-950/55 p-5 backdrop-blur-xl">
                <p className="text-sm uppercase tracking-[0.28em] text-cyan-200">
                  {user.location}
                </p>
                <h1 className="mt-2 text-4xl font-bold text-white">
                  {user.name}
                </h1>
                <p className="mt-2 text-slate-300">{user.role}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6">
          <div className="glass-card rounded-[2rem] p-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-cyan-400/25 bg-cyan-400/10 px-3 py-2 text-xs uppercase tracking-[0.22em] text-cyan-100">
                {user.trustBadge}
              </span>
              <span className="rounded-full border border-violet-400/25 bg-violet-500/10 px-3 py-2 text-xs uppercase tracking-[0.22em] text-violet-100">
                Dashboard profil
              </span>
            </div>
            <p className="mt-5 text-lg leading-8 text-slate-300">{user.bio}</p>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
                <p className="text-sm uppercase tracking-[0.22em] text-slate-400">
                  Offre phare
                </p>
                <p className="mt-3 text-lg font-medium text-white">
                  {user.heroOffer}
                </p>
              </div>
              <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
                <p className="text-sm uppercase tracking-[0.22em] text-slate-400">
                  Disponibilite
                </p>
                <p className="mt-3 text-lg font-medium text-white">
                  {user.availability}
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                href={`/contact/${user.id}`}
                className="flex-1 rounded-full bg-gradient-to-r from-violet-600 to-cyan-400 px-5 py-3 text-center font-semibold text-white"
              >
                Contacter le partenaire
              </Link>
              <Link
                href="/match"
                className="rounded-full border border-white/10 px-5 py-3 text-center font-medium text-slate-200 hover:border-cyan-400/60"
              >
                Retour au match
              </Link>
            </div>
          </div>

          <div className="glass-card rounded-[2rem] p-6">
            <p className="text-sm uppercase tracking-[0.28em] text-slate-400">
              Capacites
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {user.skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs uppercase tracking-[0.18em] text-slate-200"
                >
                  {skill}
                </span>
              ))}
              {user.timeServices.map((service) => (
                <span
                  key={service}
                  className="rounded-full border border-cyan-400/15 bg-cyan-400/10 px-3 py-2 text-xs uppercase tracking-[0.18em] text-cyan-100"
                >
                  {service}
                </span>
              ))}
            </div>
            <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
              <p className="text-sm text-slate-400">Solde estime</p>
              <p className="mt-2 text-2xl font-semibold text-white">
                {user.tokens} Skill-Tokens
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="glass-card rounded-[2rem] p-6 md:p-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-slate-400">
              Portfolio
            </p>
            <h2 className="mt-2 text-3xl font-semibold text-white">
              Projets reels du profil
            </h2>
          </div>
          <Link
            href="/marketplace"
            className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-200 hover:border-cyan-400/60"
          >
            Retour au marketplace
          </Link>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {user.portfolio.map((project) => (
            <article
              key={project.title}
              className="card-hover overflow-hidden rounded-[1.8rem] border border-white/10 bg-white/5"
            >
              <div className="relative h-72">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-5">
                <p className="text-xl font-semibold text-white">
                  {project.title}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
